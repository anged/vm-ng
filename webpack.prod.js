
const webpack = require("webpack");
const helpers = require('./helpers');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        main: './app/main.ts', // entry point for your application code
        vendor: './app/vendor.ts'
    },
    output: {
        filename: '[name].bundle.[chunkhash].js',
        publicPath: '/',
        libraryTarget: "amd"
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    optimization: {
        noEmitOnErrors: false,
        splitChunks: {
            cacheGroups: {
              vendor: {
                test: 'vendor',
                name: 'vendor',
                chunks: 'initial',
                enforce: true
              }
            }
        },
        minimizer:  [new OptimizeCSSAssetsPlugin({})]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                  'ts-loader'
                ]
            },
            {
              test: /\.html$/,
              use: {
                loader: 'html-loader',
                options: { minimize: false } // curently not minimizing with html loader
              }
            },
            {
              test: /\.css$/,
              use: [MiniCssExtractPlugin.loader, "css-loader"]
            }
        ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new HtmlWebpackPlugin({  // Also generate a test.html
        filename: 'index.html',
        template: 'index-production.html'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      }),
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          output: {
           comments: false,
           beautify: false
         }
       }
      }),
      new webpack.DefinePlugin({
         'process.env.NODE_ENV': JSON.stringify('production')
      }),
      new webpack.ContextReplacementPlugin(
        /angular(\\|\/)core(\\|\/)@angular|fesm5/,
        helpers.root('./app'),
        {}
      )
    ],
    externals: [
        function (context, request, callback) {
            if (/^dojo/.test(request) ||
                /^dojox/.test(request) ||
                /^dijit/.test(request) ||
                /^esri/.test(request) ||
                /^moment/.test(request)
            ) {
                return callback(null, "amd " + request);
            }
            callback();
        }
    ],
    devtool:  'none'
};
