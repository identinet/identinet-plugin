import { Title } from "@solidjs/meta";
import { log, S } from "~/lib/sanctuary/mod.js";
import { api, getCurrentTab, url2DID } from "~/lib/identinet/mod.js";
import { encaseP, promise, reject, resolve } from "fluture";
import { createEffect, createResource, createSignal, For } from "solid-js";
import ExternalLink from "~/components/ExternalLink.jsx";
import Credential from "~/components/Credential.jsx";
import { fetchStatus } from "../refetch-force.js";

/**
 * fetchWebsiteData retrieves the stored data for the currently selected tab.
 * @param {URL} url URL of the current tab.
 * @returns {Future<Pair<DID,Object>,Error>}
 */
function fetchWebsiteData(url) {
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
function getURL() {
  return S.pipe([
    encaseP(() => getCurrentTab()),
    S.map(([_, url]) => url), // drop tabId
    promise,
  ])("dummy argument");
}

export default function Home() {
  const [url] = createResource(getURL);
  const [isVerified, setVerified] = createSignal(false);
  const [ssiData, { refetch: refetchSSIData }] = createResource(
    url,
    fetchWebsiteData,
  );
  const verify = (presentation) =>
    presentation?.verification_result?.verified === true;
  const all = (fn) => (data) => {
    if (data !== undefined) {
      return S.pipe([S.map(fn), S.all((r) => Boolean(r))])(data);
    }
    return undefined;
  };
  createEffect(() => {
    setVerified(all(verify)(ssiData()?.presentations));
  });
  createEffect(() => {
    fetchStatus();
    refetchSSIData();
  });
  return (
    <>
      <Title>SSI Information</Title>
      <article>
        <h3 class="font-bold text-lg mb-2">
          SSI Information&nbsp;
          <img
            class="inline"
            style="height: 1em; top: -0.1em; position: relative;"
            alt="not verified"
            src={isVerified() === false
              ? "icons/shield-xmark.svg"
              : isVerified() === true
              ? "icons/shield-plus.svg"
              : S.type(ssiData()?.diddoc?.id).name === "String"
              ? "icons/shield-check.svg"
              : "icons/shield-slash.svg"}
          />
        </h3>
        <div class="flex">
          <div class="w-1/5">Page:</div>
          <div class="w-4/5">
            <ExternalLink
              url={`https:${url()?.hostname}:${url()?.port}`}
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
              url={ssiData()?.diddoc?.id &&
                `https:didlint.ownyourdata.eu/validate?did=${
                  encodeURIComponent(ssiData()?.diddoc?.id)
                }`}
              title="Inspect DID"
              text={ssiData()?.diddoc?.id}
              fallback="No DID."
            />
          </div>
        </div>

        <hr class="my-3" />

        <h4 class="font-bold text-lg my-2">Linked Presentations</h4>
        <div class="flex flex-col gap-2 py-2">
          <For
            each={ssiData()?.presentations || []}
            fallback={<div>No linked presentations.</div>}
          >
            {(verified_presentation, presentation_index) => {
              const presentation = verified_presentation.presentation;
              if (!presentation) {
                return (
                  <div class="badge badge-error badge-outline">
                    Something is wrong with this presentation.
                  </div>
                );
              }
              const verification_result =
                verified_presentation.verification_result;
              const credential_results = verification_result?.credentialResults;
              return (
                <div class="flex flex-col gap-2 py-1">
                  <div class="divider">
                    Presentation&nbsp;{presentation_index() + 1}
                  </div>
                  <For
                    each={presentation.verifiableCredential || []}
                    fallback={<div>No credentials.</div>}
                  >
                    {(credential, index) => {
                      const credential_result = credential_results?.at(index());
                      return (
                        <Credential
                          credential={credential}
                          credential_result={credential_result}
                        />
                      );
                    }}
                  </For>
                </div>
              );
            }}
          </For>
        </div>
      </article>
    </>
  );
}
