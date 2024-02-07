import { S } from "~/lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "~/lib/identinet/mod.js";
import { encaseP, promise, reject, resolve } from "fluture";
import { createResource, For } from "solid-js";
import ExternalLink from "~/components/ExternalLink.jsx";
import Credential from "~/components/Credential.jsx";

/**
 * fetchWebsiteData retrieves the stored data for the currently selected tab.
 * @returns {Future<Pair<DID,Object>,Error>}
 */
function fetchWebsiteData(params) {
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

export default function Home() {
  const [url] = createResource(getURL);
  const [ssi_data] = createResource(url, fetchWebsiteData);
  return (
    <>
      <h3 class="font-medium text-lg mb-2">
        SSI Information{" "}
        <img
          class="inline"
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
      <div class="flex">
        <div class="w-1/5">Page:</div>
        <div class="w-4/5">
          <ExternalLink
            url={`https:${url()?.hostname}`}
            title="Visit website"
            text={url()?.hostname}
            fallback="No Hostname."
          />
        </div>
      </div>
      <div class="flex">
        <div class="w-1/5">DID:</div>
        <div class="w-4/5">
          <ExternalLink
            url={`https:didlint.ownyourdata.eu/validate?did=${
              encodeURIComponent(
                ssi_data()?.diddoc?.id,
              )
            }`}
            title="Inspect DID"
            text={ssi_data()?.diddoc?.id}
            fallback="No DID."
          />
        </div>
      </div>
      <hr class="my-3" />
      <h3 class="font-medium text-lg mb-2">Credentials</h3>

      <div class="flex flex-wrap gap-2">
        <For
          each={ssi_data()?.presentation?.verifiableCredential || []}
          fallback={<div>No claims.</div>}
        >
          {(credential, _index) => <Credential credential={credential} />}
        </For>
      </div>
    </>
  );
}
