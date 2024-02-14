// Documentation: https://rollupjs.org/configuration-options/

// import eslint from "@rollup/plugin-eslint";
import path from "node:path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { terser } from "rollup-plugin-terser";
// import json from "@rollup/plugin-json";

const isProduction = process.env.NODE_ENV === "production";

const template = {
  input: "src-background/background.js",
  // dest: ".build_chrome/background.js",
  // input: {
  //   "background": "src-background/background.js",
  //   // "popup": "src-background/popup.js",
  //   // ".build_firefox/background": "src-background/background.js",
  //   // ".build_chrome/popup": "src-background/popup.js",
  //   // ".build_firefox/popup": "src-background/popup.js",
  // },
  output: {
    file: ".build/background.js",
    sourcemap: isProduction ? false : "inline",
    inlineDynamicImports: true,
    indent: false,
    format: "iife",
  },
  plugins: [
    commonjs(),
    nodePolyfills({
      include: null, // null to also process internal references
      sourceMap: isProduction ? false : "inline",
    }),
    // nodePolyfills({ include: ["utils", "process"] }),
    // json(),
    resolve(
      {
        jsnext: true,
        // main: true,
        browser: true,
        // preferBuiltins: false,
      },
    ),
    terser(),
    // eslint(),
  ],
};

export default ["src-background/background.js"].map((file) => ({
  ...template,
  input: `${file}`,
  output: { ...(template["output"]), file: `.build_${path.basename(file)}` },
}));
