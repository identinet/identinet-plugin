import { S } from "~/lib/sanctuary/mod.js";
import { Show } from "solid-js";
export default function Credential(props) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  const formatter = Intl.DateTimeFormat(navigator.language, options);
  return (
    <div className="collapse collapse-arrow border border-base-300">
      <input type="radio" name="credential-accordion-1" />
      <div className="collapse-title text-lg font-medium">
        {props.credential?.issuer || "No Issuer."}
      </div>
      <div className="collapse-content grid">
        <div style="grid-template-columns: 25% 75%;" className="text-sm grid">
          <div>Type:</div>
          <div>{props.credential?.type?.join(", ")}</div>
          <div>Issuer:</div>
          <div>{props.credential?.issuer || "No Issuer."}</div>
          <div>Created:</div>
          <div>
            {formatter.format(new Date(props.credential?.proof?.created)) ||
              "No creation Date."}
          </div>
          <div>Id:</div>
          <div>{props.credential?.id || "No credential ID."}</div>
          <Show when={typeof props.credential?.validFrom !== "undefined"}>
            <div>Valid From:</div>
            <div>{formatter.format(new Date(props.credential?.validFrom))}</div>
          </Show>
        </div>
        <div className="divider">Claims</div>
        <For
          each={S.pipe([
            S.ifElse((claims) => S.type(claims).name === "Undefined")(() => [])(
              (claims) => (S.type(claims).name === "Array" ? claims : [claims])
            ),
          ])(props.credential?.credentialSubject)}
        >
          {(claim, _index) => (
            <div className="flex gap-2 overflow-x-scroll">
              <For each={Object.keys(claim)}>
                {(key, index) => (
                  <div className="card card-compact w-36 bg-base-200">
                    <div className="card-body">
                      <h2 className="card-title text-sm">{key}</h2>
                      <p class="text-ellipsis overflow-hidden">{claim[key]}</p>
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
