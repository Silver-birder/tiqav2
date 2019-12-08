const path = require('path');
// @see https://github.com/neverendingqs/netlify-express/issues/4
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node',
    externals: [nodeExternals()],
    mode: "development",
    entry: './src/index.ts',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080
    }
};