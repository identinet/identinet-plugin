import { log, S } from "./sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "./identinet/mod.js";
import { encaseP, promise, reject, resolve } from "fluture";

/**
 * fetchWebsiteData retrieves the stored data for the currently selected tab.
 * @param {URL} url - URL of the current tab.
 * @returns {Future<Pair<DID,Object>,Error>}
 */
export function fetchWebsiteData(url) {
  return S.pipe([
    url2DID,
    S.map(S.fst),
    S.either(reject)(resolve),
    S.chain((did) =>
      S.pipe([
        encaseP((did) => api.storage.local.get(did)),
        S.map((res) => res[did]), // drop outer object
      ])(did)
    ),
    /* S.map(log("getres")), */
    /* chainRej((err) => { */
    /*   // Maybe it's a good idea to actually let the rejected promise through so that the UI can react to it */
    /*   console.log("reject", err); */
    /*   return resolve("an error occurred"); */
    /* }), */
    promise,
  ])(url);
}

/**
 * getURL gets the URL for the currently selected tab.
 * @returns {Future<URL,Error>} URL of the currently selected tab.
 */
export function getURL() {
  return S.pipe([
    S.map(([_, url]) => url), // drop tabId
    promise,
  ])(encaseP(() => getCurrentTab())());
}

/**
 * property2humanreadable makes a property human readable by stripping off an existing namespace and by makeing the
 * first letter upper case.
 * @param {String} propertyname - Property name.
 * @returns {String} Human readable version of the property name.
 */
export function property2humanreadable(propertyname) {
  return S.pipe([
    str => {
      const idx = str.indexOf(":");
      if (idx !== -1) {
        return str.slice(idx + 1);
      }
      return str;
    },
    str => str.slice(0, 1).toUpperCase() + str.slice(1),
  ])(propertyname);
}

