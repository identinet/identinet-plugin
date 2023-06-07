import { S } from "./lib/sanctuary/mod.js";

console.log("background", typeof chrome, typeof browser, chrome);

// let api = typeof chrome ? chrome : browser;

// chrome.alarms.onAlarm.addListener(function (alarm) {
//   appendToLog(
//     "alarms.onAlarm --" +
//       " name: " + alarm.name +
//       " scheduledTime: " + alarm.scheduledTime,
//   );
// });

// {did : bool}
const activeConnections = {};

/**
 * url2DID derives from a DID plus base URL from a URL object.
 *
 * @param {URL} url - A URL object.
 * @returns {Object} - {did: string, base_url: URL}
 */
function url2DID(url) {
  S.map(console.log)(["a", "b"]);
  const protocol = "https";
  const port = url.port ? url.port : 443;
  const base_url = new URL(`${protocol}://${url.hostname}:${port}`);
  let domainname = base_url.hostname;
  if (port != 443) {
    domainname = encodeURIComponent(`${domainname}:${port}`);
  }
  const did = `did:web:${domainname}`;
  return { did, base_url };
}

// async function getCurrentTab() {
//   const queryOptions = { active: true, lastFocusedWindow: true };
//   // `tab` will either be a `tabs.Tab` instance or `undefined`.
//   const [tab] = await chrome.tabs.query(queryOptions);
//   console.log("tab", tab);
//   const url = new URL(tab.url);
//   let did = url2DID(url);
//   console.log("did", did);
//   // console.log("url", url.protocol, url.hostname, url.port);
//   return tab;
// }

chrome.tabs.onActivated.addListener(async ({ tabId, windowId }) => {
  console.log("activated", tabId, windowId); // prints in the *background* console
  // let tab = await getCurrentTab();
  const tab = await chrome.tabs.get(tabId);
  console.log("tab", tab);
  const url = new URL(tab.url);
  // console.log("url", url.protocol, url.hostname, url.port);
  console.log("url", url);

  // [x] domain to DID
  // TOOD: return Some(URL) if URL present and protocoal https
  const { did, base_url } = url2DID(url);
  console.log("did", did);

  // [x] fetch doc for DID
  const diddoc_url = new URL(base_url);
  diddoc_url.pathname = "/.well-known/did.json";
  // const res = await fetch(diddoc_url, { mode: "no-cors", cache: "no-cache" });
  const res = await fetch(diddoc_url, { mode: "no-cors" });
  // add promise to store
  console.log("res", diddoc_url, res);
  // [ ] store diddoc in session cache - {did: {doc_verifed: bool, presentation: {}, persentation_verified}}
  // [ ] delete promise from store
  // [x] update action icon
  if (res.ok) {
    chrome.action.setIcon({
      path: { "128": "icons/shield-check.svg.png" },
      tabId,
    });
  } else {
    chrome.action.setIcon({
      path: { "128": "icons/shield-slash.svg.png" },
      tabId,
    });
  }

  // [x] fetch presentation
  const presentation_url = new URL(base_url);
  presentation_url.pathname = "/.well-known/presentation.json";
  const res1 = await fetch(presentation_url, {
    mode: "no-cors",
    cache: "no-cache",
  });
  console.log("res1", presentation_url, res1);
  // [ ] store VC in session cache
  // [ ] delete promise from store
  // [x] update action action
  if (res1.ok) {
    chrome.action.setIcon({
      path: { "128": "icons/shield-plus.svg.png" },
      tabId,
    });
  } else {
    chrome.action.setIcon({
      path: { "128": "icons/shield-xmark.svg.png" },
      tabId,
    });
  }

  // [ ] ui: pull in current status and display something
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("updated", tabId, changeInfo, tab, tab.url, changeInfo.status); // prints in the *background* console
  // if (changeInfo.url || changeInfo.status === "loading") {
  //   const url = changeInfo.url || tab.pendingUrl || tab.url;
  //   console.log(url); // prints in the *background* console
  // }
});
