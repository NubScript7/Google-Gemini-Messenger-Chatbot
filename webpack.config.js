// const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./dist/index.js",
  output: {
    // output bundle will be in `dist/buit.js`
    filename: "../build/bundle.min.js",
  },
  target: "node",

  mode: "development",
  devtool: "source-map",
  /*
  stats: {
    errorDetails: true
  },
  */
  
  watch: true,
  
  // optional: bundle everything into 1 file
  /*
  plugins: [
    
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    */
    /*
    new HtmlWebpackPlugin({
      title: "webpack compilation report"
    })
  ],
  */
  optimization: {
    minimize: true,
  }
  /*
  optimization: {
    minimize: true, // Enable minification
    minimizer: [
      new TerserPlugin(
      {
        terserOptions: {
          mangle: {
            properties: true,
            keep_classnames: false,
            keep_fnames: false,
            safari10: true,
            toplevel: true,
          },
        },
        
      }
      ),
    ],
  },
  */
};
