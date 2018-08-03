const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsParallelPlugin = require('webpack-uglify-parallel');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const os = require('os');
const fs = require('fs');
const path = require('path');
const package = require('../package.json');

fs.open('./build/env.js', 'w', function(err, fd) {
    const buf = 'export default "production";';
    fs.write(fd, buf, 0, buf.length, 0, function(err, written, buffer) {});
});

module.exports = merge(webpackBaseConfig, {
    output: {
        publicPath: '/CMS/',
        filename: '[name].[hash].js',
        chunkFilename: '[name].[hash].chunk.js'
    },
    plugins: [
        new cleanWebpackPlugin(['CMS/*'], {
            root: path.resolve(__dirname, '../../iBlog/public/')
        }),
        new ExtractTextPlugin({
            filename: '[name].[hash].css',
            allChunks: true
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            },
            sourceMap: false,
            parallel: true
        }),
        // new UglifyJsParallelPlugin({
        //     workers: os.cpus().length,
        //     mangle: true,
        //     compressor: {
        //       warnings: false,
        //       drop_console: true,
        //       drop_debugger: true
        //      }
        // }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true
                // more options:
                // https://github.com/kangax/html-minifier#options-quick-reference
            },
            // necessary to consistently work with multiple chunks via CommonsChunkPlugin
            chunksSortMode: 'dependency'
        })
    ]
});
