// @refresh reload
import { ErrorBoundary, Suspense } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";
import { MetaProvider } from "@solidjs/meta";
import Nav from "~/components/Nav.jsx";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./app.css";

const Layout = (props) => (
  <MetaProvider>
    <header class="font-sans">
      <Nav />
      <hr class="pb-3" />
    </header>
    <main class="container px-3 font-sans">
      <Suspense>
        {props.children}
      </Suspense>
    </main>
  </MetaProvider>
);

export default function App() {
  return (
    <Router root={Layout}>
      <FileRoutes />
    </Router>
  );
}
