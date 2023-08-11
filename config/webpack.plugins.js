const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { SourceMapDevToolPlugin } = require("webpack");
const webpack = require("webpack");

module.exports = {
  performance: { hints: false },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new VueLoaderPlugin(),
    new SourceMapDevToolPlugin({
      filename: "[file].map",
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
};
