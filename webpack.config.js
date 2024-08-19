const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "dist/index.js"),
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
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src/node_modules")]
    
  },
  
  
  //watch: true
  
  // optional: bundle everything into 1 file
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
  /*
  optimization: {
    minimize: true, // Enable minification
    
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: false
        },
      }),
    ],
    
  },
  */
  
};
