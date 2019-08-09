let bundleConfig = require("./make-webpack-config")();
bundleConfig.entry = "./src/app.js";
bundleConfig.mode = "production";
module.exports = bundleConfig;
