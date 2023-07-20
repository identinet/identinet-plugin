// Documentation: https://vitejs.dev/config/
import solid from "solid-start/vite";
import { defineConfig } from "vite";
export default defineConfig({
  // FIXME: solid-start doesn't seem to respect this setting
  // build: { outDir: ".build" },
  plugins: [
    solid({
      ssr: false,
      islands: false,
      islandsRouter: false,
    }),
  ],
});
