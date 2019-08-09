let bundleConfig = require("./make-webpack-config")();
bundleConfig.entry = "./src/app.js";
bundleConfig.mode = "development";
bundleConfig.devtool = "inline-source-map";
bundleConfig.devServer = {
    inline: true,
    // serve files from dist folder:
    contentBase: "dist"
};
module.exports = bundleConfig;
