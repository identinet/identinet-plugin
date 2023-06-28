import { $, log, S } from "./lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./lib/identinet/mod.js";
import { bichain, chainRej, encaseP, promise, reject, resolve } from "fluture";
import { defaultDocumentLoader, verify } from "@digitalbazaar/vc";
import jsigs from "jsonld-signatures";
import { Ed25519Signature2020 } from "@digitalbazaar/ed25519-signature-2020";
import { Ed25519Signature2018 } from "@digitalbazaar/ed25519-signature-2018";

/**
 * fetchPath is a wrapper for fetch that simplifies retrieving DID and VC data
 * with no-cors enabled.
 *
 * @param {string} pathname - Path that will be fetched.
 * @param {URL} url - URL object that will be passed to fetch.
 * @returns {Future<Response,Error>} that resolves the fetch Promise.
 */
const fetchPath = (pathname) => (url) => {
  const url_copy = new URL(url);
  url_copy.pathname = pathname;
  console.log(`fetching ${url_copy}`);
  return encaseP((url) => fetch(url, { mode: "no-cors" }))(url_copy);
};

/**
 * setIcon sets the extension's action item for the specified tab.
 *
 * @param {number} tabId - Tab number.
 * @param {string} path - Path to the icon that will be set.
 * @returns {number} Tab number.
 */
const setIcon = (tabId) => (path) => {
  api.action.setIcon({
    path: path,
    tabId,
  });
  return tabId;
};

const setIconSlash = (tabId) => {
  setIcon(tabId)("icons/shield-slash.svg.png");
};

const setIconCheck = (tabId) => {
  setIcon(tabId)("icons/shield-check.svg.png");
};

const setIconPlus = (tabId) => {
  setIcon(tabId)("icons/shield-plus.svg.png");
};

const setIconXmark = (tabId) => {
  setIcon(tabId)("icons/shield-xmark.svg.png");
};

/**
 * storeDIDDoc stores the DID document from a response object in the local
 * store. It ensures that passed in DID matches the one in the document
 * or returns an error.
 *
 * @param {string} did - The DID that the document shall be stored for.
 * @param {JSON} diddoc - DID document.
 * @returns {Future<Array<string, JSON>,Error>} returns the DID that the document has been stored at and the DID document.
 */
const storeDIDDoc = (did) => (diddoc) =>
  S.pipe([
    (diddoc) =>
      diddoc?.id === did
        ? resolve(diddoc)
        : reject("DID document doesn't match expected DID"),
    S.chain((diddoc) =>
      S.pipe([
        encaseP((did) => api.storage.local.get(did)),
        // S.map(log("get store")),
        chainRej((_err) => ({})), // in case no data is in the store, return an empty dataset
        S.chain(encaseP((stored_data) =>
          api.storage.local.set({
            [did]: { diddoc, ...stored_data[did] },
          })
        )),
        S.map(() => [did, diddoc]),
        S.map(log("stored")),
      ])(did)
    ),
  ])(diddoc);

const updateDID = (tabId) => (url) => {
  return S.pipe([
    // domain to DID
    url2DID,
    S.map(log("did")),
    // fetch doc for DID
    S.either(reject)(resolve),
    S.chain(({ did, base_url }) =>
      S.pipe([
        // TODO: optimize over fetching
        fetchPath("/.well-known/did.json"),
        S.chain(
          S.ifElse((res) => res.ok)(
            (res) => {
              setIconSlash(tabId);
              return resolve(res);
            },
          )(() => reject(new Error("fetching DID document failed"))),
        ),
        // store diddoc in local cache - {did: {doc_verifed: bool, presentation: {}, persentation_verified}}
        S.chain(encaseP((res) => res.json())),
        S.chain(storeDIDDoc(did)),
        // update action icon
        S.map((did_and_doc) => {
          setIconCheck(tabId);
          return S.Pair(base_url)(S.Pair(did_and_doc[0])(did_and_doc[1]));
        }),
      ])(base_url)
    ),
    // construct suite
    bichain((err) => {
      console.log("reject", err);
      setIconSlash(tabId);
      return resolve("an error occurred");
    })(
      // [x] fetch and verify presentation
      (pair) =>
        S.pipe([
          // TODO: only fetch the presentation if it's referenced in the DID
          // document - verifiable data registry
          fetchPath("/.well-known/presentation.json"),
          S.chain(
            S.ifElse((res) => res.ok)(
              (res) => {
                setIconXmark(tabId);
                return resolve(res);
              },
            )((res) => reject(new Error("failed to fetch presentation"))),
          ),
          // [i] verify presentation and VCs
          S.chain(encaseP((res) => res.json())),
          S.chain(encaseP((presentation) => {
            // TODO: add support for ECDSA
            // TODO: add support for JWS - no implementation available yet, see https://github.com/w3c/vc-jws-2020
            const suite = [
              new Ed25519Signature2018(),
              new Ed25519Signature2020(),
            ];
            // customer loader that supports DID and verification method
            const did = S.fst(S.snd(pair));
            const diddoc = S.snd(S.snd(pair));
            const verificationMethods = S.pipe([
              S.get(S.is($.Array($.NonEmpty($.String))))("assertionMethod"),
              S.map(S.map((id) =>
                S.pipe([
                  S.get(S.is($.Array($.StrMap($.Unknown))))(
                    "verificationMethod",
                  ),
                  S.fromMaybe([]),
                  S.filter((vm) => vm.id === id),
                  S.head,
                ])(diddoc)
              )),
              S.map(S.filter(S.isJust)),
              S.map(S.map(S.fromMaybe({}))),
              S.fromMaybe([]),
              S.reduce((acc) => (vm) => {
                const vm_ld = { ...vm, "@context": diddoc["@context"] }; // @context is required in the verificationMethod to make it a valid linked data document
                acc[vm_ld.id] = vm_ld;
                return acc;
              })({}),
            ])(diddoc);
            const documentLoader = jsigs.extendContextLoader((url) => {
              // FIXME: it seems like this isn't used, yet?!
              log("documentLoader", url);
              // resovle DIDDoc and verification Method via document loader
              if (url === did) {
                return {
                  contextUrl: null,
                  documentUrl: url,
                  document: diddoc,
                };
              }
              if (verificationMethods[url]) {
                return {
                  contextUrl: null,
                  documentUrl: url,
                  document: verificationMethods[url],
                };
              }
              return defaultDocumentLoader(url);
            });
            return verify({
              suite,
              presentation,
              presentationPurpose: new jsigs.purposes.AssertionProofPurpose({
                // controller: did,
                domain: url.hostname, // it's expected that the presentation is issued to the domain name of the website
              }),
              documentLoader,
            });
          })),
          S.map(log("verify")),
          // [ ] store VC in local cache
          // [x] update action action
        ])(S.fst(pair)),
      // [ ] ui: pull in current status and display something
    ),
    chainRej((err) => {
      console.warn("reject", err);
      setIconXmark(tabId);
      return resolve("an error occurred");
    }),
    promise,
  ])(url);
};

async function initialUpdate() {
  try {
    const [tabId, url] = await getCurrentTab();
    return updateDID(tabId)(url);
  } catch (err) {
    console.warn(err);
  }
}

api.tabs.onActivated.addListener(async ({ tabId, _windowId }) => {
  try {
    const tab = await api.tabs.get(tabId);
    const url = new URL(tab.url);
    return updateDID(tabId)(url);
  } catch (err) {
    console.warn(err);
  }
});

api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "loading") {
    // console.log("updated", tabId, changeInfo, tab, tab.url, changeInfo.status); // prints in the *background* console
    const url = new URL(tab.url);
    return updateDID(tabId)(url);
  }
});

initialUpdate();
