import { $, log, S } from "./lib/sanctuary/mod.js";
import {
  api,
  convertJWKtoMultibase,
  getCurrentTab,
  url2DID,
} from "./lib/identinet/mod.js";
import { bichain, chainRej, encaseP, promise, reject, resolve } from "fluture";
import { defaultDocumentLoader, verify } from "@digitalbazaar/vc";
import jsigs from "jsonld-signatures";
import {
  Ed25519Signature2020,
  suiteContext as suiteContext2020,
} from "@digitalbazaar/ed25519-signature-2020";
import {
  Ed25519Signature2018,
  suiteContext as suiteContext2018,
} from "@digitalbazaar/ed25519-signature-2018";

class DIDNotFoundError extends Error {
}

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
 * @param {Pair<string,JSON>} did_pair - The DID and the document that shall be stored for.
 * @returns {Future<string,Error>} returns the DID that the document has been stored at.
 */
const storeDIDDoc = (did_pair) => {
  const did = S.fst(did_pair);
  const diddoc = S.snd(did_pair);
  if (diddoc?.id !== did) {
    return reject("DID document doesn't match expected DID");
  }
  return S.pipe([
    encaseP((did) => api.storage.local.get(did)),
    // S.map(log("get store")),
    chainRej((_err) => ({})), // in case no data is in the store, fall back on an empty dataset
    S.chain(encaseP((stored_data) =>
      api.storage.local.set({
        [did]: { diddoc, ...stored_data[did] },
      })
    )),
    S.map(() => did),
  ])(did);
};

/**
 * getDIDDocForURL retrieves the DID Document for a given URL.
 *
 * @param {URL} url - The URL that shall be spected for a DID Document.
 * @returns {Future<Pair<URL,Pair<did,diddoc>>,Error>} - If successful, the url
 * with did and diddoc will be returned.
 */
const getDIDDocForURL =
  // TODO: migrate to https://identity.foundation/.well-known/resources/did-configuration/
  S.pipe([
    // domain to DID
    url2DID,
    // fetch DID doc
    S.either(reject)(resolve),
    S.chain(
      (did_pair) =>
        S.pipe([
          // TODO: optimize over fetching
          fetchPath("/.well-known/did.json"),
          S.chain(
            S.ifElse((response) => response.ok)(resolve)(() =>
              reject(new DIDNotFoundError("fetching DID document failed"))
            ),
          ),
          S.chain(encaseP((response) => response.json())),
          S.map((diddoc) =>
            S.Pair(S.snd(did_pair))(S.Pair(S.fst(did_pair))(diddoc))
          ),
        ])(S.snd(did_pair)),
    ),
  ]);

/**
 * getPresentationForURL retrieves the presentation for a given URL.
 *
 * @param {Pair<URL,Pair<string,object>>} pair - Pair that consists of the URL
 * and the DID and DID document.
 * @returns {}
 */
const verifyPresentation = (did_pair) => (presentation) => {
  // TODO: add support for ECDSA
  // TODO: add support for JWS - no implementation available yet, see https://github.com/w3c/vc-jws-2020
  const suite = [
    new Ed25519Signature2018(),
    new Ed25519Signature2020(),
  ];
  // customer loader that supports DID and verification method
  const url = S.fst(did_pair);
  const diddoc = S.snd(S.snd(did_pair));
  const did = diddoc?.id;
  const verificationMethods = S.pipe([
    S.get(S.is($.Array($.NonEmpty($.String))))("assertionMethod"),
    S.map(S.map((id) =>
      S.pipe([
        S.get(S.is($.Array($.StrMap($.Unknown))))("verificationMethod"),
        S.fromMaybe([]),
        S.filter((vm) => vm.id === id),
        S.head,
      ])(diddoc)
    )),
    S.map(S.filter(S.isJust)),
    S.map(S.map(S.fromMaybe({}))),
    S.fromMaybe([]),
    S.reduce((acc) => (vm) => {
      let publicKeyMultibase = vm?.publicKeyMultibase;
      if (
        vm.type == "Ed25519VerificationKey2020" &&
        publicKeyMultibase === undefined &&
        vm?.publicKeyJwk !== undefined
      ) {
        // convert JWK key to multibase format that's required by Ed25519VerificationKey2020
        publicKeyMultibase = convertJWKtoMultibase(vm)?.publicKeyMultibase;
      }
      const vm_ld = {
        ...vm,
        publicKeyMultibase,
        // @context is required in the verificationMethod to make it a valid linked data document
        "@context": diddoc["@context"],
      };
      acc[vm_ld.id] = vm_ld;
      return acc;
    })({}),
  ])(diddoc);
  const documentLoader = jsigs.extendContextLoader((url) => {
    // log("documentLoader")(url);
    // resovle DIDDoc and verification Method via document loader
    if (url === suiteContext2020.CONTEXT_URL) {
      return suiteContext2020.documentLoader(url);
    }
    if (url === suiteContext2018.CONTEXT_URL) {
      return suiteContext2018.documentLoader(url);
    }
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
  return encaseP(verify)({
    suite,
    presentation,
    presentationPurpose: new jsigs.purposes.AssertionProofPurpose({
      // controller: did,
      // domain: url.hostname, // FIXME: domain is only validated for authentication proof purposes
    }),
    documentLoader,
  });
};

/**
 * getPresentationForURL retrieves the presentation for a given URL.
 *
 * @param {Pair<URL,Pair<string,object>>} did_pair - Pair that consists of the URL
 * and the DID and DID document.
 * @returns {Future<object,Error>} - Verification result.
 */
const getPresentationForURL = (did_pair) =>
  // [x] fetch and verify presentation
  S.pipe([
    // TODO: only fetch the presentation if it's referenced in the DID
    // document - verifiable data registry
    fetchPath("/.well-known/presentation.json"),
    S.chain(
      S.ifElse((response) => response.ok)(
        resolve,
        // (response) => {
        //   setIconXmark(tabId);
        //   return resolve(response);
        // },
      )((response) => reject(new Error("failed to fetch presentation"))),
    ),
    // [i] verify presentation and VCs
    S.chain(encaseP((response) => response.json())),
    S.chain(verifyPresentation(did_pair)),
    S.map(log("verify")),
    // [ ] store VC in local cache
    // [x] update action action
  ])(S.fst(did_pair));
// [ ] ui: pull in current status and display something

const updateDID = (tabId) => (url) => {
  setIconSlash(tabId);
  return S.pipe([
    getDIDDocForURL,
    // store diddoc in local cache - {did: {doc_verifed: bool, presentation: {}, persentation_verified}}
    S.chain((did_pair) =>
      S.pipe([
        S.snd,
        storeDIDDoc,
        // update action icon
        S.map(() => {
          setIconCheck(tabId);
          return did_pair;
        }),
      ])(did_pair)
    ),
    bichain((err) => {
      if (err instanceof DIDNotFoundError) {
        setIconSlash(tabId);
        return resolve("DID document not found");
      }
      // icon is set at the the end of the update function, don't do it here
      console.error(err);
      return reject("An error occurred while accessing DID document");
    })(getPresentationForURL),
    chainRej((err) => {
      setIconXmark(tabId);
      console.error(err);
      return resolve("An error occurred"); // reconcile all errors so there are no uncaught rejected promises around
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
