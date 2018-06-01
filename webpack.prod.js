
const webpack = require("webpack");
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

var plugins = [
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin('dist/style.css'),
    // new HtmlWebpackPlugin({  // Also generate a test.html
    //   filename: 'test.html',
    //   template: 'index.html'
    // })
    new UglifyJsPlugin({
      sourceMap: true
    }),
    new webpack.DefinePlugin({
       'process.env.NODE_ENV': JSON.stringify('production')
     })
]

const styles = {
  test: /\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    "css-loader"
  ]
};

const minimizer = [
  new UglifyJsPlugin({
    sourceMap: true
  })
];

module.exports = {
    entry: {
        main: './app/main.ts', // entry point for your application code
        vendor: './app/vendor.ts'
    },
    output: {
        filename: '[name].bundle.js',
        publicPath: '/',
        libraryTarget: "amd"
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
              vendor: {
                chunks: 'initial',
                name: 'dist/vendor',
                test: 'vendor',
                enforce: true
              }
            }
        }//,
        //minimizer
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                  'ts-loader'
                ]
            },
            // css
            styles
        ]
    },
    plugins: plugins,
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
    devtool:  'source-map'
};
