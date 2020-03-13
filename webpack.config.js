const htmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');


module.exports = {
    entry: "./src/main/index.ts",
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: "bundle.js"
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    },

    mode: "development",

    devtool: "inline-source-map",

    plugins: [
        new CleanWebpackPlugin(),
        new ManifestPlugin()
    ],

    module: {
        rules: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { test: /\.tsx?$/, use: ["ts-loader"], exclude: /node_modules/ },
            // css style files
            { test: /\.css$/, use:["style-loader", "css-loader"]},
            // images files
            { test: /\.(png|svg|jpg|gif|jpeg|icon)$/, use:["file-loader"]},
            // font files
            { test: /\.(woff|woff2|eot|ttf|otf)$/, use:["file-loader"]},
            // data files
            { test: /\.(csv|tsv)$/, use:["csv-loader"]},
            { test: /\.xml$/, use:["xml-loader"]},
            { test: /\.json$/, use:["json-loader"]},
            { test: /\.json5$/, use:["json5-loader"]},
        ]
    }
};