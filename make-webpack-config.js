// Creates a default webpack config
// NOTE: this is a function! Use it like 'require("./make-webpack-config")()'

const webpack = require("webpack");
const copyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = function() {
    return {
        resolve: {
            extensions: ['.webpack.js', '.web.js', '.js']
        },
        plugins: [
            // without specifying additional variables, `process.env.NODE_ENV` will be set to development or production depending on webpack mode
            new webpack.DefinePlugin({}),
            // copy index.html to dist folder:
            new copyWebpackPlugin([
                { from: "index.html", to: "index.html"}
            ])
        ],
        entry: "./src/app.js",
        output: {
            path: path.join(__dirname, "dist"),
            filename: "bundle.js"
        }
    };
};
