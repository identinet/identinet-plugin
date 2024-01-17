import { S } from "../sanctuary/mod.js";
import { idPlusItem } from "./fixtures/storageItems.js";

export { convertJWKtoMultibase } from "./conversion.js";
export { verifyPresentation } from "./presentation.js";

const isDevelopment = process.env.NODE_ENV == "development";

/**
 * api offers access to the browser's extension interface regardless of whether
 * Chrome or Firefox is used.
 */
export let api;
if (typeof chrome != "undefined") {
  api = chrome;
} else if (typeof browser != "undefined") {
  api = browser;
} else {
  api = {
    tabs: {
      query: async () => {
        return [
          {
            id: 1,
            url: "https://id-plus-example.identinet.io/",
          },
        ];
      },
    },
    storage: {
      local: {
        get: async (did) => {
          return idPlusItem;
        },
      },
    },
  };
}

/**
 * url2DID takes a URL and derives the did:web DID and a new URL object that can
 * be used for interacting with the DID.
 *
 * @param {URL} url - An URL object that's used to derive the did:web DID.
 * @returns {Either<Pair<String,URL>>} - returns the DID and a new URL object.
 */
export function url2DID(url) {
  if (url.protocol != "https:") {
    return S.Left(new Error("URL protocol not support"));
  }
  const protocol = "https";
  const port = url.port ? url.port : 443;
  const base_url = new URL(`${protocol}://${url.hostname}:${port}`);
  const domainname = encodeURIComponent(base_url.host); // port is included if it isn't the default port for the protocol
  const did = `did:web:${domainname}`;
  return S.Right(S.Pair(did)(base_url));
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
