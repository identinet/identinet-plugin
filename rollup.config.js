// import eslint from "@rollup/plugin-eslint";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import nodePolyfills from "rollup-plugin-polyfill-node";

export default [{
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
    // sourcemap: "inline",
    inlineDynamicImports: true,
    format: "iife",
  },
  plugins: [
    commonjs(),
    nodePolyfills(),
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
}, {
  input: "src/popup.js",
  output: {
    file: ".build/popup.js",
    // sourcemap: "inline",
    inlineDynamicImports: true,
    format: "iife",
  },
  plugins: [
    commonjs(),
    nodePolyfills(),
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
}];
