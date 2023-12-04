// Documentation: https://vitejs.dev/config/
import solid from "solid-start/vite";
import solidSvg from "vite-plugin-solid-svg"; // Documentation: https://github.com/jfgodoy/vite-plugin-solid-svg
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
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
    UnoCSS({
      injectReset: true,
    }),
    solid({
      ssr: false,
      islands: false,
      islandsRouter: false,
    }),
    solidSvg({
      svgo: {
        enabled: true,
        svgoConfig: {
          plugins: [
            {
              name: "preset-default",
              params: {
                overrides: {
                  // viewBox is required to resize SVGs with CSS.
                  // @see https://github.com/svg/svgo/issues/1128
                  // @see https://github.com/jfgodoy/vite-plugin-solid-svg/issues/26
                  removeViewBox: false,
                },
              },
            },
          ],
        },
      },
    }),
  ],
});
