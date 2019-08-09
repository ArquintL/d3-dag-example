// Creates a default webpack config
// NOTE: this is a function! Use it like 'require("./make-webpack-config")()'

const webpack = require("webpack");
const copyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = function() {
    return {
        resolve: {
            // Add `.ts` as a resolvable extension.
            extensions: ['.webpack.js', '.web.js', '.ts', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.ts$/, 
                    enforce: "pre",
                    loader: "tslint-loader"
                },
                // all files with a `.ts` extension will be handled by `awesome-typescript-loader`
                { 
                    test: /\.ts$/, 
                    loaders: [
                        "awesome-typescript-loader"
                    ]
                }
            ]
        },
        plugins: [
            // without specifying additional variables, `process.env.NODE_ENV` will be set to development or production depending on webpack mode
            new webpack.DefinePlugin({}),
            // copy index.html to dist folder:
            new copyWebpackPlugin([
                { from: "index.html", to: "index.html"}
            ])
        ],
        output: {
            path: path.join(__dirname, "dist"),
            filename: "bundle.js"
        }
    };
};
