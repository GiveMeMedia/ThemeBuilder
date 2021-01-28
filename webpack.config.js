const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const TerserPlugin = require("terser-webpack-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

// module.exports = {
//     mode: 'development',
//     cache: false,
//     context: path.resolve(__dirname, 'src'),
//     entry: [
//         './style/style.scss',
//         './js/test.js',
//     ],
//     output: {
//         path: path.resolve(__dirname, './theme/assets/'),
//         filename: 'js/[name].js'
//     },
//     module: {
//         rules: [
//             {
//                 test: /\.(scss|css)$/,
//                 exclude: /node_modules/,
//                 include: /style/,
//                 use: [
//                     MiniCssExtractPlugin.loader,
//                     'css-loader',
//                     'postcss-loader',
//                     'sass-loader'
//                 ],
//                 sideEffects: true,
//             },
//         ],
//     },
//     plugins: [
//         new MiniCssExtractPlugin({
//             filename: 'style/[name].css',
//         }),
//         new webpack.BannerPlugin({
//             banner: "File created by: GiveMeMedia"
//         })
//     ]
// };

module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    },
    cache: false,
    entry: toObject(glob.sync('./src/**/*.*')),
    output: {
        path: path.resolve(__dirname, './theme/assets'),
        filename: '[name].js'
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
            filename: '[name].css',
        }),
        new webpack.BannerPlugin({
            banner: "Theme created with ThemeBuilder by GiveMe.Media" +
                "\https://github.com/GiveMeMedia/ThemeBuilder"
        }),
        new FixStyleOnlyEntriesPlugin({ silent: true }),
    ]
};


function toObject(paths) {
    let ret = {};
    paths.forEach(function(path) {
        ret[path.split('/').slice(-1)[0].split('.')[0]] = path;
    });
    return ret;
}
