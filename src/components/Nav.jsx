import { A } from "solid-start";

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <img
            alt="logo"
            src="/figures/identinet_long_background_white.svg"
            height="1em"
            style="top: -0.2em; position: relative"
          />
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
