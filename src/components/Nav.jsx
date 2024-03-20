import { A } from "@solidjs/router";

export default function Nav() {
  let menu;
  return (
    <div class="navbar bg-base-100 py-0 px-3 min-h-0">
      <div class="navbar-start">
        <a
          href="https://identinet.io/"
          target="_blank"
        >
          <img
            alt="logo"
            src={window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "/figures/identinet_long_background_dark.svg"
              : "/figures/identinet_long_background_transparent.svg"}
            class="h-1.3em"
          />
        </a>
      </div>
      <div class="navbar-center">
      </div>
      <div class="navbar-end">
        <details class="dropdown dropdown-end" ref={menu}>
          <summary tabIndex={0} class="btn btn-ghost btn-circle avatar">
            <div class="i-mdi-menu" />
          </summary>
          <ul
            onclick={() => menu.removeAttribute("open")}
            tabIndex={0}
            class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <A href="/" end={true}>SSI Information</A>
            </li>
            <li>
              <A href="/privacy" end={true}>Privacy</A>
            </li>
            <li>
              <A href="/about" end={true}>About</A>
            </li>
          </ul>
        </details>
      </div>
    </div>
  );
}
