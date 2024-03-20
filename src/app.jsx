// @refresh reload
import { For, Show, Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { MetaProvider } from "@solidjs/meta";
import Nav from "~/components/Nav.jsx";
import { api } from "~/lib/identinet/mod.js";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./app.css";
import { fetchStatus, forceRefetch } from "./refetch-force.js";

const isDevelopment = process.env.NODE_ENV === "development";

const Layout = (props) => {
  return (
    <MetaProvider>
      <header class="font-sans">
        <Show when={isDevelopment}>
          <div class="p-3 bg-#eee dark:bg-blue opacity-80">
            Dev mode! Select DIDs:
            <ul class="list-circle list-inside">
              <For each={api.storage.local.getKeys()}>
                {(did) => (
                  <li>
                    <a
                      class="link"
                      href={`#`}
                      onclick={() => {
                        api.storage.local.setKey(did);
                        forceRefetch(!fetchStatus());
                      }}
                    >
                      {did}
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </div>
          <hr />
        </Show>
        <Nav />
        <hr />
      </header>
      <main class="container p-3 font-sans">
        <Suspense>{props.children}</Suspense>
      </main>
    </MetaProvider>
  );
};

export default function App() {
  return (
    <Router root={Layout}>
      <FileRoutes />
    </Router>
  );
}
