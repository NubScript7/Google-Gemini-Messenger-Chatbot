const webpack = require("webpack");

module.exports = {
  entry: "./src/main.js",
  output: {
    // output bundle will be in `dist/buit.js`
    filename: `bundle.js`,
  },
  target: 'node',
  mode: 'production',
  // optional: bundle everything into 1 file
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    })
  ],
};
