const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const entries = require('./entries.webpack');


module.exports = {
    mode: 'development',
    cache: false,
    context: path.resolve(__dirname, 'src'),
    entry: entries,
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js'
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                exclude: /node_modules/,
                include: /style/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
                sideEffects: true,
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'style/[name].css',
        }),
        new webpack.BannerPlugin({
            banner: "File created by: GiveMeMedia"
        })
    ]
};
