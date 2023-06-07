// {did : bool}
const activeConnections = {};

async function getCurrentTab() {
  const queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await chrome.tabs.query(queryOptions);
  console.log("tab", tab);
  const url = new URL(tab.url);
  console.log("url", url.protocol, url.hostname, url.port);
  return tab;
}

chrome.tabs.onActivated.addListener((tabId, windowId) => {
  console.log("activated", tabId, windowId); // prints in the *background* console
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log("updated", tabId, changeInfo.url, changeInfo.status); // prints in the *background* console
  // if (changeInfo.url || changeInfo.status === "loading") {
  //   const url = changeInfo.url || tab.pendingUrl || tab.url;
  //   console.log(url); // prints in the *background* console
  // }
});
