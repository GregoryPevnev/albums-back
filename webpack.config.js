const path = require("path");
const externals = require("webpack-node-externals");
const CleanPlugin = require("clean-webpack-plugin");

module.exports = {
    entry: "./src/index.ts",
    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js"
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: [/node_modules/],
                use: "ts-loader"
            }
        ]
    },
    plugins:
        String(process.env.NODE_ENV) === "production"
            ? [new CleanPlugin(path.join(__dirname, "dist"))] // Clean up directory in production
            : [],
    target: "node",
    externals: externals(),
    node: {
        __dirname: false,
        __filename: false
    }
};
