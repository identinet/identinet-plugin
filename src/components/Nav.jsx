import { A } from "@solidjs/router";

export default function Nav() {
  return (
    <div className="navbar bg-base-100 py-0 px-3 min-h-0">
      <div className="navbar-start">
        <a
          className="btn btn-ghost"
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
      <div className="navbar-center">
      </div>
      <div className="navbar-end">
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div class="i-mdi-information-outline" />
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <A href="/">Page</A>
            </li>
            <li>
              <A href="/privacy">Privacy</A>
            </li>
            <li>
              <A href="/about">About</A>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
