import { $, log, S } from "../src/lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID, ProtocolError } from "../src/lib/identinet/mod.js";
import {
  bichain,
  chainRej,
  encaseP,
  parallel,
  promise,
  reject,
  resolve,
} from "fluture";
import {
  fetchAndVerifyPresentation,
  getLinkedPresentationURLs,
} from "./utils.js";

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
 * @param {Object} diddoc - The DID document that shall be stored.
 * @returns {Future<Object,Error>} returns the DID document has been stored.
 */
const storeDIDDoc = (diddoc) => {
  const did = diddoc.id;
  return S.pipe([
    encaseP((did) => api.storage.local.get(did)),
    // S.map(log("get did store")),
    chainRej((_err) => ({})), // in case no data is in the store, fall back on an empty dataset
    S.chain(encaseP((stored_data) =>
      api.storage.local.set({
        [did]: { diddoc },
      })
    )),
    // S.map(log("result did?")),
    S.map(() => diddoc),
  ])(did);
};

/**
 * storePresentations stores the Veriable Presentations from a response object in
 * the local store.
 *
 * @param {string} did - The DID that the presentation shall be stored for.
 * @param {Pair<object,object>} presentation_and_result - The presentation with
 * a result object that shall be stored.
 * @returns {Future<string,Error>} returns the DID that the presentation has
 * been stored at.
 */
const storePresentations = (did) => (presentations) => {
  // console.log("storing", did, presentations);
  return S.pipe([
    encaseP((did) => api.storage.local.get(did)),
    // S.map(log("get store")),
    chainRej((_err) => ({})), // in case no data is in the store, fall back on an empty dataset
    S.chain(encaseP((stored_data) =>
      api.storage.local.set({
        [did]: {
          presentations: S.map((presentation_result) => ({
            presentation: S.fst(presentation_result),
            verification_result: S.snd(presentation_result),
          }))(presentations),
          ...stored_data[did],
        },
      })
    )),
    // S.map(log("result?")),
    S.map(() => did),
  ])(did);
};

/**
 * W3C DID.
 * @typedef {string} DID
 */

/**
 * W3C DID Document.
 * @typedef {object} DIDDoc
 */

/**
 * W3C DID Document.
 * @typedef {object} Future
 */

/**
 * getDIDDocForURL retrieves the DID Document for a given URL.
 *
 * @param {URL} url The URL that shall be inspected for a DID Document.
 * @returns {Future<Pair<URL,Object>,Error>} If successful, url and {did, diddoc} will be returned.
 */
function getDIDDocForURL(url) {
  return S.pipe([
    // domain to DID
    url2DID,
    // fetch DID doc
    S.either(reject)(resolve),
    S.chain(
      (url_did_pair) =>
        S.pipe([
          // TODO: add support for https://identity.foundation/.well-known/resources/did-configuration/
          // TODO: optimize overfetching
          fetchPath("/.well-known/did.json"),
          S.chain(
            S.ifElse((response) => response.ok)(resolve)(() =>
              reject(new DIDNotFoundError("fetching DID document failed"))
            ),
          ),
          S.chain(encaseP((response) => response.json())),
          S.map((
            diddoc,
          ) => (S.Pair(url)({ did: S.fst(url_did_pair), diddoc }))),
        ])(S.snd(url_did_pair)),
    ),
  ])(url);
}

/**
 * updateDID retrieves DID and LinkedVerifiablePresentation data for a website.
 * @param {number} - tabId Tab number.
 * @param {URL} url - The URL that shall be inspected for a Presentation.
 * @returns {Promise<DID,Error>} DID for the URL/tab.
 */
const updateDID = (tabId) => (url) => {
  let setIcon = setIconSlash;
  return S.pipe([
    // Fetch DID document
    // ------------------
    getDIDDocForURL,
    S.chain((url_did_pair) => {
      const { did, diddoc } = S.snd(url_did_pair);
      if (diddoc?.id !== did) {
        return reject("DID document doesn't match expected DID");
      }
      return resolve(diddoc);
    }),
    // store diddoc in local cache - {did: {doc_verifed: bool, presentation: {}, persentation_verified}}
    S.chain(
      S.pipe([
        storeDIDDoc,
        S.map((diddoc) => {
          // console.log("stored diddoc", diddoc);
          // update action icon
          setIcon = setIconCheck;
          return diddoc;
        }),
      ]),
    ),
    // Fetch linked presentations
    // --------------------------
    bichain(
      (err) => {
        if (err instanceof DIDNotFoundError) {
          return resolve("DID document not found");
        }
        if (err instanceof ProtocolError) {
          return resolve(err.message);
        }
        // icon is set at the the end of the update function, don't do it here
        console.error(err);
        return reject("An error occurred while accessing DID document");
      },
    )(
      (diddoc) =>
        S.pipe([
          getLinkedPresentationURLs,
          // S.map(log("getLinkedPresentationURLs")),
          S.map(fetchAndVerifyPresentation(diddoc)),
          parallel(5),
          // S.map(log("results")),
          S.chain((presentations) => {
            if (presentations.length === 0) {
              // DID has no linked presentations
              return resolve(diddoc.id);
            }
            return S.pipe([
              // [x] store VP and result in local cache
              storePresentations(diddoc.id),
              // [x] update action icon
              S.chain((did) => {
                const verified = S.map((presentation_result) => {
                  const result = S.snd(presentation_result);
                  return result?.error?.errors?.length >= 0 ||
                    result?.verified !== true;
                })(presentations);
                if (S.all((v) => v === true)(verified)) {
                  return reject(presentations);
                } else {
                  setIcon = setIconPlus;
                }
                return resolve(did);
              }),
            ])(presentations);
          }),
        ])(diddoc),
    ),
    // Error handling
    // --------------------------
    chainRej((err) => {
      setIcon = setIconXmark;
      console.error(err);
      return resolve("An error occurred"); // reconcile all errors so there are no uncaught rejected promises around
    }),
    S.bimap((err) => {
      // log("err")(err);
      setIcon(tabId);
      return err;
    })((res) => {
      // log("res")(res);
      setIcon(tabId);
      return res;
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
