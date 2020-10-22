const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config");
const devConfig = {
    mode: "development",
    devtool: "source-map",
    devServer: {
        open: true,
    },
};

module.exports = merge(baseConfig, devConfig);
