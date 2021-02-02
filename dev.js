#!/usr/bin/env node-
const webpack = require('webpack');
const themeKit = require('@shopify/themekit');
const yargs = require('yargs/yargs');
const {hideBin} = require('yargs/helpers');
const colors = require('colors');
const webpackConfig = require("./webpack.config");
const chokidar = require('chokidar');
require('dotenv').config()

let watching = null;

const watcher = chokidar.watch('./src', {
    ignored: /^\./,
    persistent: true,
    ignoreInitial: true,
});

let compiler = webpack(webpackConfig);

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
    .option('tw', {
        type: 'boolean',
        default: false,
        description: "Run the themekit watch command"
    })
    .command("watch", 'Start watching theme and compiler', (yargs) => {

    }, (argv) => {
        console.log(colors.blue.bold('LOAD') + ': Started watching files');
        watchCompiler(argv);
        if (argv.tw)
            watchThemeKit(argv);
    })
    .option('environment', {
        alias: 'env',
        default: 'development',
        description: 'Run the commands for a specific environment'
    })
    .argv;

function CreateShopifyTheme() {
    themeKit.command("new", {
        password: process.env.store_password,
        store: process.env.store_url,
        name: `ThemeBuilder Theme by ${process.env.author}`,
        dir: './theme/'
    });
}

function buildCompiler() {
    compiler.compile((err, stats) => {
        if (!err)
            console.log(colors.green.bold("SUCC") + ": Files compiled")
    })
}

function watchCompiler() {
    watching = compiler.watch({
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

function startCompiler() {
    console.log(argv);
}

function stopCompiler() {
    compiler = webpack(webpackConfig);
    if(watching != null)
        watching.close();
}



watcher
    .on('add', function (path) {
        stopCompiler();
        console.log(`${colors.blue.bold("LOAD")}: File was added, restarting compiler`);
        watchCompiler();
    })
    .on('unlink', function (path) {
        stopCompiler();
        console.log(`${colors.blue.bold("LOAD")}: File was removed, restarting compiler`);
        watchCompiler();
    })
    .on('error', function (error) {
        console.error('Error happened', error);
    })
