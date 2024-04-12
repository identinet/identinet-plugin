import { S } from "~/lib/sanctuary/mod.js";
import { Show } from "solid-js";
export default function Credential(props) {
  if (!props.credential) {
    console.warn("No credential given", props);
    return (
      <div class="badge badge-error badge-outline">
        Something is wrong with this credential
      </div>
    );
  }

  const credential = props.credential;
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  let checked = false;
  const formatter = Intl.DateTimeFormat(navigator.language, options);
  const isVerified = props.credential_result.verified || false;

  return (
    <div class="collapse collapse-arrow border border-base-300">
      <input
        type="radio"
        name="credential-accordion"
        onclick={(e) => {
          // close accordion upon click
          if (checked) {
            checked = e.target.checked = !checked;
          }
        }}
        onchange={(e) => {
          checked = e.target.checked;
        }}
      />
      <div
        class="collapse-title text-lg font-medium flex flex-col bg-no-repeat pl-10"
        style={`background-size: 1rem; background-position: 1rem; background-image: url(${isVerified ? "icons/shield-plus.svg" : "icons/shield-xmark.svg"
          })`}
      >
        {
          ((S.type(credential.type).name === "String" && [credential.type]) || (S.type(credential.type).name === "Array" && credential.type)).filter(t => t !== "VerifiableCredential").join(", ") || "Verifiable Credential"
        }
      </div>
      <div class="collapse-content grid">
        <div style="grid-template-columns: 25% 75%;" class="text-sm grid">
          <div>Credential Id:</div>
          <div>{credential.id || "No credential ID."}</div>
          <div>Subject:</div>
          <div>{credential.credentialSubject.id || "No subject ID."}</div>
          <div>Issuer:</div>
          <div>{credential.issuer || "No Issuer."}</div>
          <div>Issued:</div>
          <div>
            {formatter.format(
              new Date(credential.issuanceDate || credential.issued),
            ) || "No issuance date."}
          </div>
          <Show when={typeof credential.validFrom !== "undefined"}>
            <div>Valid From:</div>
            <div>{formatter.format(new Date(credential.validFrom))}</div>
          </Show>
          <Show
            when={typeof credential.validUntil !== "undefined" ||
              typeof credential.expirationDate !== "undefined"}
          >
            <div>Valid Until:</div>
            <div>
              {formatter.format(
                new Date(credential.expirationDate || credential.validUntil),
              )}
            </div>
          </Show>
        </div>
        <div class="divider">Claims</div>
        <For
          each={S.pipe([
            S.ifElse((claims) => S.type(claims).name === "Undefined")(() => [])(
              (claims) => S.type(claims).name === "Array" ? claims : [claims]
            ),
          ])(credential.credentialSubject)}
        >
          {(claim, _index) => (
            <div class="flex gap-2 flex-wrap">
              <For each={Object.keys(claim).filter(key => key !== "id")}>
                {(key, index) => (
                  <div class="card card-compact w-36 flex-grow flex-shrink bg-base-200">
                    <div class="card-body">
                      <h2 class="card-title text-sm">{key}</h2>
                      <p class="text-ellipsis overflow-hidden">{["Object", "Array"].includes(S.type(claim[key]).name) ? JSON.stringify(claim[key]) : claim[key]}</p>
                    </div>
                  </div>
                )}
              </For>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
