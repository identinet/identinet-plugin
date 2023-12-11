import solid from "solid-start/vite";
import solidSvg from "vite-plugin-solid-svg"; // Documentation: https://github.com/jfgodoy/vite-plugin-solid-svg
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const isProduction = process.env.NODE_ENV == "production";

export default defineConfig({
  server: {
    port: 3000,
  },
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
    UnoCSS(),
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
    nodePolyfills({
      include: ["utils"],
    }),
  ],
});
