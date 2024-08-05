const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./dist/index.js",
  output: {
    // output bundle will be in `dist/buit.js`
    filename: "../build/bundle.min.js",
  },
  target: "node",
  mode: "production",
  /*
  stats: {
    errorDetails: true
  },
  */
  
  //watch: true
  
  // optional: bundle everything into 1 file
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: {
            properties: true,
            keep_classnames: false,
            keep_fnames: false,
            safari10: true,
            toplevel: true,
            eval: true
          },
        },
      }),
    ],
  },
  
};
