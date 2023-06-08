import { log, S } from "./lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./lib/identinet/mod.js";
import { chainRej, encaseP, promise, reject, resolve } from "fluture";

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

/**
 * storeDIDDoc stores the DID document from a response object in the local
 * store. It ensures that passed in DID matches the one in the document
 * or returns an error.
 *
 * @param {string} did - The DID that the document shall be stored for.
 * @param {Resoponse} resoponse - A response object that will yield the DID document.
 * @returns {Future<string,Error>} returns the DID that the document has been
 * stored at.
 */
const storeDIDDoc = (did) => (response) => {
  return S.pipe([
    encaseP((r) => r.json()),
    // S.map(log("diddoc")),
    S.chain((diddoc) =>
      diddoc?.id === did
        ? resolve(diddoc)
        : reject("DID document doesn't match expected DID")
    ),
    S.chain((body) =>
      S.pipe([
        encaseP((did) => api.storage.local.get(did)),
        // S.map(log("get store")),
        chainRej((_err) => ({})), // in case no data is in the store, return an empty dataset
        S.chain(encaseP((stored_data) =>
          api.storage.local.set({
            [did]: { diddoc: body, ...stored_data[did] },
          })
        )),
        S.map(() => did),
        S.map(log("stored")),
      ])(did)
    ),
  ])(response);
};

const updateDID = (tabId) => (url) => {
  return S.pipe([
    // domain to DID
    url2DID,
    S.map(log("did")),
    // fetch doc for DID
    S.either(reject)(resolve),
    S.chain(({ did, base_url }) =>
      S.pipe([
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
        S.chain(storeDIDDoc(did)),
        // update action icon
        S.map((res) => {
          setIconCheck(tabId);
          return res;
        }),
      ])(base_url)
    ),
    chainRej((err) => {
      console.log("reject", err);
      setIconSlash(tabId);
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
    console.log(err);
  }
}

api.tabs.onActivated.addListener(async ({ tabId, _windowId }) => {
  const res = await fetch("https://identinet.io/.well-known/did.json", {
    mode: "no-cors",
  });
  try {
    const tab = await api.tabs.get(tabId);
    const url = new URL(tab.url);
    return updateDID(tabId)(url);
  } catch (err) {
    console.log(err);
  }

  // // [x] fetch presentation
  // const presentation_url = new URL(base_url);
  // presentation_url.pathname = "/.well-known/presentation.json";
  // const res1 = await fetch(presentation_url, {
  //   mode: "no-cors",
  // });
  // console.log("res1", presentation_url, res1);
  // // [ ] store VC in local cache
  // // [ ] delete promise from store
  // // [x] update action action
  // if (res1.ok) {
  //   api.action.setIcon({
  //     path: { "128": "icons/shield-plus.svg.png" },
  //     tabId,
  //   });
  // } else {
  //   api.action.setIcon({
  //     path: { "128": "icons/shield-xmark.svg.png" },
  //     tabId,
  //   });
  // }

  // [ ] ui: pull in current status and display something
});

api.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status == "loading") {
    // console.log("updated", tabId, changeInfo, tab, tab.url, changeInfo.status); // prints in the *background* console
    const url = new URL(tab.url);
    return updateDID(tabId)(url);
  }
});

initialUpdate();
