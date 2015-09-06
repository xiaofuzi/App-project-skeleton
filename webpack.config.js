var path = require('path');
var webpack = require("webpack");

module.exports = {
    cache: true,
    entry: "./entry.js",
    output: {
        path: path.join(__dirname, "dist/js"),
        publicPath: "dist/",
        filename: "bundle.js"
    },
    plugins: [
        new webpack.ProvidePlugin({
            // Automtically detect jQuery and $ as free var in modules
            // and inject the jquery library
            // This is required by many jquery plugins
            jQuery: "jquery",
            $: "jquery"
        })
    ]
};