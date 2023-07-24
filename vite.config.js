// Documentation: https://vitejs.dev/config/
import solid from "solid-start/vite";
import { defineConfig } from "vite";
// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import nodePolyfills from "rollup-plugin-polyfill-node";

const isProduction = process.env.NODE_ENV == "production";

export default defineConfig({
  build: {
    sourcemap: isProduction ? false : "inline",
    // FIXME: solid-start doesn't seem to respect this setting
    // outDir: ".build"
    // rollupOptions: {
    //   plugins: [
    //     // Enable rollup polyfills plugin
    //     // used during production bundling
    //     commonjs(),
    //     nodePolyfills(),
    //     // json(),
    //     resolve(
    //       {
    //         jsnext: true,
    //         // main: true,
    //         browser: true,
    //         // preferBuiltins: false,
    //       },
    //     ),
    //     // eslint(),
    //   ],
    // },
  },
  plugins: [
    solid({
      ssr: false,
      islands: false,
      islandsRouter: false,
    }),
  ],
});
