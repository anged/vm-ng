
const webpack = require("webpack");
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const DEVELOPEMENT = process.env.NODE_ENV === 'developement'; //true / false
const PRODUCTION = process.env.NODE_ENV === 'production';
console.log('PRODUCTION: ', PRODUCTION );

var plugins = [
  new webpack.DefinePlugin({
     'process.env.NODE_ENV': JSON.stringify('development')
   })
]


const styles ={
    test: /\.css$/,
    use: [
      "style-loader",
      "css-loader"
    ]
};

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
                name: 'vendor',
                test: 'vendor',
                enforce: true
              }
            }
        }
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
    devtool: 'source-map'
};
