// @refresh reload
import { ErrorBoundary, Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { MetaProvider } from "@solidjs/meta";
import Nav from "~/components/Nav.jsx";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./app.css";

export default function App() {
  return (
    <MetaProvider>
      <header class="font-sans">
        <Nav />
        <hr class="pb-3" />
      </header>
      <main class="container px-3 pb-3 font-sans">
        <Router root={(props) => <Suspense>{props.children}</Suspense>}>
          <ErrorBoundary
            fallback={(err, reset) => (
              <div onClick={reset}>Error: {err.toString()}</div>
            )}
          >
            <FileRoutes />
          </ErrorBoundary>
        </Router>
      </main>
    </MetaProvider>
  );
}
