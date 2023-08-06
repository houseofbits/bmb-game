const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    performance: {hints: false},
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css'
        }),
        new VueLoaderPlugin(),
        // new HtmlWebpackPlugin({
        //     template: '/dist/index.html',
        //     inject: true,
        //     chunks: ['main'],
        //     filename: 'index.html'
        // }),
        // new HtmlWebpackPlugin({
        //     template: '/dist/edit.html',
        //     inject: true,
        //     chunks: ['edit'],
        //     filename: 'edit.html'
        // }),
    ]
};