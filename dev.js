#!/usr/bin/env node
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const entries = require('./entries.webpack');
const themeKit = require('@shopify/themekit');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const colors = require('colors');
const dotenv = require('dotenv');
const env = dotenv.config()

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

let argv = yargs(hideBin(process.argv))
    .command('new', 'upload new theme to env', (yargs) => {
        yargs
            .positional('port', {
                describe: 'port to bind on',
                default: 5000
            })
    }, (argv) => {
        CreateShopifyTheme();
    })
    .command("watch", 'Start watching the compiler', (yargs) => {
        // Todo
    }, (argv) => {
        watchCompiler(argv);
        watchThemeKit(argv);
    })
    .option('environment', {
        alias: 'env',
        default: 'development',
        description: 'Run the commands for a specific environment'
    })
    .option('tw', {
        type: 'boolean',
        default: false,
        description: "Run the themekit watch command"
    })
    .argv;

function CreateShopifyTheme() {
    themeKit.command("new", {
        password: process.env.store_password,
        store: process.env.store_url,
        name: 'ThemeBuilder theme'
    })
}

function buildCompiler() {
    compiler.compile((err, stats) => {
        if (!err)
            console.log(colors.green.bold("SUCC") + ": Files compiled")
    })
}

function watchCompiler() {
    const watching = compiler.watch({
        aggregateTimeout: 300,
        poll: undefined
    }, (err, stats) => { // [Stats Object](#stats-object)
        if (!err)
            console.log(colors.green.bold("SUCC") + ": Files compiled");
        //console.log(stats);
    });
}

function watchThemeKit(argv) {
    themeKit.command('watch', {
        env: argv.env
    });
}

// watching.close(() => {
//     console.log('Watching Ended.');
// });
