import { log, S } from "~/lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "~/lib/identinet/mod.js";
import { chainRej, encaseP, promise, reject, resolve } from "fluture";
import { createResource, For } from "solid-js";
import { Title, useRouteData } from "solid-start";

/**
 * fetchWebsiteData retrieves the stored data for the currently selected tab.
 * @returns {Future<Pair<DID,Object>,Error>}
 */
function fetchWebsiteData(params) {
  return S.pipe([
    log("params"),
    url2DID,
    S.map(S.fst),
    S.either(reject)(resolve),
    S.map(log("did")),
    S.chain((did) =>
      S.pipe([
        encaseP((did) => api.storage.local.get(did)),
        S.map((res) => res[did]), // drop outer object
      ])(did)
    ),
    S.map(log("getres")),
    /* chainRej((err) => { */
    /*   // Maybe it's a good idea to actually let the rejected promise through so that the UI can react to it */
    /*   console.log("reject", err); */
    /*   return resolve("an error occurred"); */
    /* }), */
    promise,
  ])(params);
}

/**
 * getURL gets the URL for the currently selected tab.
 * @returns {Future<URL,Error>} URL of the currently selected tab.
 */
function getURL() {
  return S.pipe([
    encaseP(() => getCurrentTab()),
    S.map(([_, url]) => url), // drop tabId
    promise,
  ])("dummy argument");
}

export function routeData({ _params }) {
  const [url] = createResource(getURL);
  const [ssi_data] = createResource(url, fetchWebsiteData);
  return [url, ssi_data];
}

export default function Home() {
  const [url, ssi_data] = useRouteData();
  return (
    <main>
      <Title>Self-Sovereign Identity Information</Title>
      <h3>
        SSI Information{" "}
        <img
          style="height: 1em; top: -0.1em; position: relative;"
          alt="not verified"
          src={ssi_data()?.verification_result?.verified === false
            ? "icons/shield-xmark.svg"
            : ssi_data()?.verification_result?.verified === true
            ? "icons/shield-plus.svg"
            : S.type(ssi_data()?.diddoc?.id).name === "String"
            ? "icons/shield-check.svg"
            : "icons/shield-slash.svg"}
        />
      </h3>
      <div class="grid" style="grid-template: auto / 5em auto;">
        <p>Page:</p>
        <p>{url()?.hostname || "No Hostname."}</p>
        <p>DID:</p>
        <p>{ssi_data()?.diddoc?.id || "No DID."}</p>
        <p>Claims:</p>
        <div>
          <ul>
            <For
              each={ssi_data()?.presentation?.verifiableCredential || []}
              fallback={<li>No claims.</li>}
            >
              {(credential, index) => (
                <li>
                  {credential?.type?.join(" ")} ({credential?.id || "No ID."})
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </main>
  );
}
