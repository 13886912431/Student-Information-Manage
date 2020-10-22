const WebpackBundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const baseConfig = require("./webpack.config");
const { merge } = require("webpack-merge");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");

const prodConfig = {
    mode: "production",
    devtool: "none",
    optimization: {
        splitChunks: {
            chunks: "all",

            cacheGroups: {
                styles: {
                    test: /\.css$/i,
                    minChunks: 2,
                    minSize: 0,
                }
            },
        },
        minimize: true,
        minimizer: [new TerserWebpackPlugin(), new OptimizeCssAssetsWebpackPlugin()],
    },
    plugins: [new WebpackBundleAnalyzer()],
};

module.exports = merge(baseConfig, prodConfig);
