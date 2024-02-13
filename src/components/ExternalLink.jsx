import { S } from "~/lib/sanctuary/mod.js";
import { Show } from "solid-js";
import LinkIcon from "~/icons/external-link.svg";

export default function ExternalLink(props) {
  return (
    <Show
      when={S.type(props.url).name === "String"}
      fallback={props.fallback || "No fallback."}
    >
      <div class="flex flex-items-center">
        {props.text || "No text."}&nbsp;
        <a
          href={props.url}
          title={props.title || ""}
          target="_blank"
          style="color: var(--primary);"
        >
          <LinkIcon
            height="0.8em"
            width="0.8em"
          />
        </a>
      </div>
    </Show>
  );
}
