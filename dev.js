#!/usr/bin/env node
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const entries = require('./entries.webpack');
const themeKit = require('@shopify/themekit');
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

let arg = yargs(hideBin(process.argv))
    .command('new', 'upload new theme to env', (yargs) => {
        yargs
            .positional('port', {
                describe: 'port to bind on',
                default: 5000
            })
    }, (argv) => {
        if (argv.verbose) console.info(`start server on :${argv.port}`)
        serve(argv.port)
    })
    .option('verbose', {
        alias: 'v',
        type: 'boolean',
        description: 'Run with verbose logging'
    })
    .argv;


themeKit.command('version');

const compiler = webpack({
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
});

const watching = compiler.watch({
    aggregateTimeout: 300,
    poll: undefined
}, (err, stats) => { // [Stats Object](#stats-object)
    if(!err)
        console.log("Started watching");
    //console.log(stats);
});
themeKit.command('watch').then(r => console.log("done"));

// watching.close(() => {
//     console.log('Watching Ended.');
// });
