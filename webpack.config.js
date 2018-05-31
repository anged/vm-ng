
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HTMLWebpackPlugin = require("html-webpack-plugin");

var DEVELOPEMENT = process.env.NODE_ENV === 'developement'; //true / false
var PRODUCTION = process.env.NODE_ENV === 'production';
console.log('PRODUCTION: ', PRODUCTION);

var plugins = PRODUCTION
  ? [ ]
  : [ ];

plugins.push(
  new webpack.optimize.CommonsChunkPlugin({
        names: ['main', 'vendor'],
        minChunks: Infinity
  }),
  new webpack.DefinePlugin({
        'process.env': {
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
          },
          DEVELOPEMENT: JSON.stringify(DEVELOPEMENT),
          PRODUCTION: JSON.stringify(PRODUCTION)
  })
);

  var styles = PRODUCTION
    ? { }
    : {
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
        filename: 'dist/[name].bundle.js',
        publicPath: PRODUCTION ? '/' :'/',
        libraryTarget: "amd"
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                  'ts-loader'
                ]//,
                //exclude: ''
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
    devtool: PRODUCTION ? '(none)' : 'source-map'
};
