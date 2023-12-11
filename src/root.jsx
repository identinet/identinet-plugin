// @refresh reload
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import Nav from "~/components/Nav.jsx";

import "@unocss/reset/tailwind.css";
import "virtual:uno.css";
import "./root.css";

const isDevelopment = process.env.NODE_ENV == "development";

export default function Root() {
  return (
    <Html lang="en" class={isDevelopment ? "isDev" : ""}>
      <Head>
        <Title>identinet-plugin</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="font-sans">
        <Suspense>
          <ErrorBoundary>
            <header>
              <Nav />
              <hr class="pb-3" />
            </header>
            <main class="container px-3">
              <Routes>
                <FileRoutes />
              </Routes>
            </main>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
