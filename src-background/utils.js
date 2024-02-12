import { verifyPresentation } from "../src/lib/identinet/mod.js";
import { encaseP, reject, resolve } from "fluture";
import { S } from "../src/lib/sanctuary/mod.js";

/**
 * getLinkedPresentationURLs retrieves LinkedVerifiablePresentation(s) URL that are referenced in the service section of
 * DID document.
 *
 * @param {DIDDoc} diddoc - W3C DID document.
 * @returns {Array<URL>} list of LinkedVerifiablePresentation URLs.
 */
export function getLinkedPresentationURLs(diddoc) {
  // TODO: expand json-ld DIDDoc first, before accessing services to ensure that the correct service type is selected.
  const services = S.type(diddoc?.service).name === "Object"
    ? [diddoc?.service]
    : S.type(diddoc?.service).name === "Array"
    ? diddoc?.service
    : [];
  return S.pipe([
    S.map((s) => {
      if (s?.type === "LinkedVerifiablePresentation") {
        if (S.type(s?.serviceEndpoint).name === "Array") {
          return S.filter((v) => S.type(v).name === "String")(
            s.serviceEndpoint,
          );
        } else if (S.type(s?.serviceEndpoint).name === "String") {
          return [s.serviceEndpoint];
        }
      } else {
        return [];
      }
    }),
    S.join,
    S.filter((url) => {
      const isSupportURL = url.startsWith("https://");
      if (!isSupportURL) {
        console.warn("Ignoring unsupported URL", url);
      }
      return isSupportURL;
    }),
  ])(services);
}

/**
 * fetchAndVerifyPresentation retrieves the given URL and verifies presentation.
 *
 * @param {DIDDoc} didoc - W3C DID document.
 * @param {URL} url - URL of the presentation.
  @returns {Future<object,Error>} Retrieved presentation and verification result `{presentation, verification_result}`.
 */
export const fetchAndVerifyPresentation = (diddoc) => (url) => {
  return S.pipe([
    encaseP((url) => fetch(url, { mode: "no-cors", cache: "no-cache" })),
    S.chain(
      S.ifElse((response) => response.ok)(resolve)((response) => {
        console.error(response);
        return reject(new Error("failed to fetch presentation"));
      }),
    ),
    // [i] verify presentation and VCs
    S.chain(encaseP((response) => response.json())),
    S.chain(verifyPresentation(diddoc)),
  ])(url);
};
