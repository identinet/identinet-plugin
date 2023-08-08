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
    <div style="display:grid;grid-template-columns: 25% 75%; border: 1px solid lightgrey; margin-bottom: 0.3em; padding: 0.3em">
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
        <div>
          {formatter.format(new Date(props.credential?.validFrom))}
        </div>
      </Show>
      <div>Claims:</div>
      <For
        each={S.pipe([
          S.ifElse((claims) => S.type(claims).name === "Undefined")(() => [])(
            (claims) => S.type(claims).name === "Array" ? claims : [claims],
          ),
        ])(props.credential?.credentialSubject)}
      >
        {(claim, _index) => (
          <div style="display: grid; grid-template-columns: 25% 75%; border: 1px solid lightgrey; margin-bottom: 0.3em; padding: 0.3em">
            <For each={Object.keys(claim)}>
              {(key, index) => (
                <>
                  <div>{key}:</div>
                  <div>{claim[key]}</div>
                </>
              )}
            </For>
          </div>
        )}
      </For>
    </div>
  );
}
