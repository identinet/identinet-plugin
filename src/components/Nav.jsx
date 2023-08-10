import { A } from "solid-start";

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <a href="https://identinet.io/" target="_blank">
            <img
              alt="logo"
              src={window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "/figures/identinet_long_background_dark.svg"
                : "/figures/identinet_long_background_transparent.svg"}
              style="height: 1em; top: -0.2em; position: relative"
            />
          </a>
        </li>
      </ul>
      <ul>
        <li>
          <A href="/" activeClass="active" end="true">Page</A>
        </li>
        <li>
          <A href="/privacy" activeClass="active" end="true">
            Privacy
          </A>
        </li>
        <li>
          <A href="/about" activeClass="active" end="true">
            About
          </A>
        </li>
      </ul>
    </nav>
  );
}
