let bundleConfig = require("./make-webpack-config")();
bundleConfig.mode = "production";
module.exports = bundleConfig;
