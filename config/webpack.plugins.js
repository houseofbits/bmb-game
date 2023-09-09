const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { VueLoaderPlugin } = require("vue-loader");
const { SourceMapDevToolPlugin } = require("webpack");
const webpack = require("webpack");
const { VuetifyPlugin } = require("webpack-plugin-vuetify");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const packageVersion = require("../package.json").version;

module.exports = {
  performance: { hints: false },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
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
    new VuetifyPlugin({
      autoImport: true,
      // styles: { configFile: "app/style/variables.scss" },
    }),
    new HtmlWebpackPlugin({
      inject: false,
      templateContent: ({ htmlWebpackPlugin }) => `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>BMBGAME ${packageVersion}</title>      
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
        ${htmlWebpackPlugin.tags.headTags}
      </head>
        <body oncontextmenu="return false;">
        <div id="gui"></div>
        ${htmlWebpackPlugin.tags.bodyTags}
      </body>
    </html>
  `,
    }),
  ],
};
