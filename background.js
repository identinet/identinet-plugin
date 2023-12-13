import { verifyPresentation } from "./src/lib/identinet/mod.js";
import { $, log, S } from "./src/lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./src/lib/identinet/mod.js";
import { bichain, chainRej, encaseP, promise, reject, resolve } from "fluture";

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
  return encaseP((url) => fetch(url, { mode: "no-cors", cache: "no-cache" }))(
    url_copy,
  );
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
    // S.map(log("get did store")),
    chainRej((_err) => ({})), // in case no data is in the store, fall back on an empty dataset
    S.chain(encaseP((stored_data) =>
      api.storage.local.set({
        [did]: { diddoc, ...stored_data[did] },
      })
    )),
    // S.map(log("result did?")),
    S.map(() => did),
  ])(did);
};

/**
 * storePresentation stores the Veriable Presentation from a response object in
 * the local store.
 *
 * @param {string} did - The DID that the presentation shall be stored for.
 * @param {Pair<object,object>} presentation_and_result - The presentation with
 * a result object that shall be stored.
 * @returns {Future<string,Error>} returns the DID that the presentation has
 * been stored at.
 */
const storePresentation = (did) => (presentation_and_result) => {
  return S.pipe([
    encaseP((did) => api.storage.local.get(did)),
    // S.map(log("get store")),
    chainRej((_err) => ({})), // in case no data is in the store, fall back on an empty dataset
    S.chain(encaseP((stored_data) =>
      api.storage.local.set({
        [did]: {
          presentation: S.fst(presentation_and_result),
          verification_result: S.snd(presentation_and_result),
          ...stored_data[did],
        },
      })
    )),
    // S.map(log("result?")),
    S.map(() => did),
  ])(did);
};

/**
 * getDIDDocForURL retrieves the DID Document for a given URL.
 *
 * @param {URL} url - The URL that shall be inspected for a DID Document.
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
          // TODO: optimize overfetching
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
 * @param {URL} url - The URL that shall be inspected for a Presentation.
 * @returns {Future<object,Error>} - Returns the JSON endoced the presentation object.
 */
const getPresentationForURL = S.pipe([
  // [x] fetch presentation
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
]);
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
    })((url_did_pair) =>
      S.pipe([
        getPresentationForURL,
        bichain(
          // ignore fetch errors as they are expected, not every don't domain
          // offers a presentation.json
          resolve,
        )(S.pipe([
          // [x] verify presentation
          verifyPresentation(url_did_pair),
          // S.map(log("verified")),
          S.chain((result_pair) =>
            S.pipe([
              // [x] store VP and result in local cache
              storePresentation(S.fst(S.snd(url_did_pair))),
              // [x] update action icon
              S.chain((did) => {
                const verification_result = S.snd(result_pair);
                if (
                  verification_result?.error?.errors?.length >= 0 ||
                  verification_result?.verified !== true
                ) {
                  return reject(verification_result);
                } else {
                  setIconPlus(tabId);
                }
                return resolve(did);
              }),
            ])(result_pair)
          ),
        ])),
      ])(S.fst(url_did_pair))
    ),
    chainRej((err) => {
      setIconXmark(tabId);
      console.error(err);
      return resolve("An error occurred"); // reconcile all errors so there are no uncaught rejected promises around
    }),
    bichain((err) => {
      // log("err")(err);
      return reject(err);
    })((res) => {
      // log("res")(res);
      return resolve(res);
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
