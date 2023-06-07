import { log, S } from "./lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./lib/identinet/mod.js";
import { chainRej, encaseP, promise, reject, resolve } from "fluture";

const fetchPath = (pathname) => (url) => {
  const url_copy = new URL(url);
  url_copy.pathname = pathname;
  console.log(`fetching ${url_copy}`);
  return encaseP((url) => fetch(url, { mode: "no-cors" }))(url_copy);
};

/**
 * fromResult triggers side effects based on a the results of a Response
 * object. Be careful when reading from the Response since this can only be done
 * once and the Response is returned from this function, so other functions
 * might try to read from it again and fail!
 *
 * @param {Function} notOkFn - Called with the resonse object in case the result is not ok.
 * @param {Function} okFn - Called with the resonse object in case the result is ok.
 * @returns {Response} returns the passed in response object.
 */
const resultOkOr = (notOkFn) => (okFn) => (response) => {
  console.log("response", response);
  if (response.ok) {
    if (typeof okFn === "function") {
      console.log("run okFn");
      okFn(response);
    }
    return response;
  }
  if (typeof notOkFn === "function") {
    console.log("run notOkFn");
    notOkFn(response);
  }
  return response;
};

const setIcon = (tabId) => (path) => {
  api.action.setIcon({
    path: path,
    tabId,
  });
  return tabId;
};

const setIconSlash = (tabId) => () => {
  setIcon(tabId)("icons/shield-slash.svg.png");
};

const setIconCheck = (tabId) => () => {
  setIcon(tabId)("icons/shield-check.svg.png");
};

const storeDIDDoc = (did) => (response) => {
  S.pipe([
    encaseP((r) => r.json()),
    S.map(log("json")),
    S.chain((body) =>
      S.pipe([
        encaseP(api.storage.session.get(did)),
        chainRej((_err) => ({})),
        S.map(log("stored")),
        S.chain((stored_data) =>
          encaseP(
            api.storage.session.set({
              [did]: { diddoc: body, ...stored_data },
            }),
          )
        ),
      ])(did)
    ),
  ])(response);
};

const updateDID = (tabId) => (url) => {
  return S.pipe([
    // [x] domain to DID
    url2DID,
    S.map(log("did")),
    // [x] fetch doc for DID
    S.either(reject)(resolve),
    S.chain(({ did, base_url }) =>
      S.pipe([
        // FIXME: somehow the object isn't fetched properly
        fetchPath("/.well-known/did.json"),
        S.map(log("res")),
        // [ ] store diddoc in session cache - {did: {doc_verifed: bool, presentation: {}, persentation_verified}}
        S.map(resultOkOr()(storeDIDDoc(did))),
        // [x] update action icon
        S.map(resultOkOr(setIconSlash(tabId))(setIconCheck(tabId))),
        S.map(log("action")),
      ])(base_url)
    ),
    chainRej((err) => {
      console.log("reject", err);
      // console.error(err);
      setIconSlash(tabId)();
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
  console.log("resres", res);
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
  // // [ ] store VC in session cache
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
