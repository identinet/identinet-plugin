// Documentation: https://webpack.js.org/configuration/

// const path = require("path");
import webpack from "webpack";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
const __dirname = dirname(fileURLToPath(import.meta.url));
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";

const BUILD_DIR = ".build";

const config = {
  // target: ["web", "es2020"],
  target: "web",
  entry: { background: "./src/background.js", popup: "./src/popup.js" },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, BUILD_DIR),
  },
  plugins: [
    new NodePolyfillPlugin(),
    new webpack.DefinePlugin({
      global: "window", // Placeholder for global used in any node_modules
    }),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  node: {
    // prevent webpack from injecting eval / new Function through global polyfill
    global: false,
    __filename: false,
    __dirname: false,
  },
  resolve: {
    aliasFields: ["browser"],
    alias: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setimmediate: false,
      "function-bind": false,
      "is-generator-function": false,
    },
  },
};

const isProduction = process.env.NODE_ENV == "production";

export default (() => {
  if (isProduction) {
    config.mode = "production";
    config.devtool = false;
  } else {
    // config.mode = "development";
    // config.devtool = "source-map";
    // config.devtool = "inline-source-map";
    config.devtool = false;
    // config.plugins.push(new webpack.SourceMapDevToolPlugin({}));
  }
  return config;
})();
