// import solid from "solid-start/vite";
import solidSvg from "vite-plugin-solid-svg"; // Documentation: https://github.com/jfgodoy/vite-plugin-solid-svg
import UnoCSS from "unocss/vite";
// import { defineConfig } from "vite";
import { defineConfig } from "@solidjs/start/config";
import { nodePolyfills } from "vite-plugin-node-polyfills";

const isProduction = process.env.NODE_ENV == "production";

const config = defineConfig({
  start: {
    ssr: false,
    islands: false,
    server: {
      preset: "static",
    },
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: isProduction ? false : "inline",
    // ssr: false,
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
    // solid({
    //   ssr: false,
    //   islands: false,
    //   islandsRouter: false,
    // }),
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
    // nodePolyfills({ include: ["utils", "process"] }),
    nodePolyfills({
      globals: {
        // Buffer: true, // can also be 'build', 'dev', or false
        global: true,
        process: true,
      },
    }),
  ],
});

// INFO: workaround for Chrome add-on that don't allow underscores in the
// extension directory
config.config.routers[2].base = "/build";
// Speed up build by removing unused routers
delete config.config.routers[3]; // server functions
// delete config.config.routers[2]; // client
// delete config.config.routers[1]; // ssr
// delete config.config.routers[0]; // static

export default config;
