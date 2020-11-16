const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const pages = require("./pages");

function getEntry() {
    const entry = {};
    for (const key in pages) {
        entry[key] = pages[key].js;
    }
    return entry;
}

function getHtmlPlugin() {
    const html = [];
    for (const key in pages) {
        html.push(
            new HtmlWebpackPlugin({
                template: pages[key].html,
                chunks: [key],
                filename: pages[key].filename,
                favicon: "./favicon.ico",
            })
        );
    }
    return html;
}

module.exports = {
    entry: getEntry(),
    output: {
        filename: "js/[name].[chunkhash:3].js",
        chunkFilename: "common/common.[chunkhash:3].js",
        publicPath: "/",
    },
    stats: {
        colors: true,
        modules: false,
        entrypoints: false,
        children: false,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.js$/i,
                use: "babel-loader",
                exclude: /jquery/,
            },
        ],
        noParse: /jquery/,
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "common/common.[chunkhash:3].css",
        }),
        ...getHtmlPlugin(),
        new CleanWebpackPlugin(),
    ],
};
