let bundleConfig = require("./make-webpack-config")();
bundleConfig.mode = "development";
bundleConfig.devtool = "inline-source-map";
bundleConfig.devServer = {
    inline: true,
    // serve files from dist folder:
    contentBase: "dist"
};
module.exports = bundleConfig;
