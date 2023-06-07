import { log, S } from "../sanctuary/mod.js";

export let api;
if (typeof chrome) {
  api = chrome;
} else {
  api = browser;
}

/**
 * url2DID derives from a DID plus base URL from a URL object.
 *
 * @param {URL} url - A URL object.
 * @returns {Either<Object>} - {did: string, base_url: URL}
 */
export function url2DID(url) {
  if (url.protocol != "https:") {
    return S.Left(new Error("URL protocol not support"));
  }
  const protocol = "https";
  const port = url.port ? url.port : 443;
  const base_url = new URL(`${protocol}://${url.hostname}:${port}`);
  let domainname = base_url.hostname;
  if (port != 443) {
    domainname = encodeURIComponent(`${domainname}:${port}`);
  }
  const did = `did:web:${domainname}`;
  return S.Right({ did, base_url });
}

export async function getCurrentTab() {
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  const [tab] = await api.tabs.query({
    active: true,
    lastFocusedWindow: true,
  });
  const url = new URL(tab.url);
  return [tab.id, url];
}
