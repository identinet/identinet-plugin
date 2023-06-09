// Documentation: https://rollupjs.org/configuration-options/

// import eslint from "@rollup/plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";
// import json from "@rollup/plugin-json";

const isProduction = process.env.NODE_ENV == "production";

const template = {
  input: "src/background.js",
  // dest: ".build_chrome/background.js",
  // input: {
  //   "background": "src/background.js",
  //   // "popup": "src/popup.js",
  //   // ".build_firefox/background": "src/background.js",
  //   // ".build_chrome/popup": "src/popup.js",
  //   // ".build_firefox/popup": "src/popup.js",
  // },
  output: {
    file: ".build/background.js",
    sourcemap: isProduction ? false : "inline",
    inlineDynamicImports: true,
    format: "iife",
  },
  plugins: [
    commonjs(),
    nodePolyfills(),
    // json(),
    resolve(
      {
        jsnext: true,
        // main: true,
        browser: true,
        // preferBuiltins: false,
      },
    ),
    // eslint(),
  ],
};

console.log(["background.js", "popup.js"].map((file) => ({
  ...template,
  input: `src/${file}`,
  output: { ...(template["output"]), file: `.build/${file}` },
})));
export default ["background.js", "popup.js"].map((file) => ({
  ...template,
  input: `src/${file}`,
  output: { ...(template["output"]), file: `.build/${file}` },
}));
