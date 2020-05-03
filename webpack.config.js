const path = require('path');
const nodeExternals = require('webpack-node-externals')

module.exports = {
    entry: './src/server/index.ts',
    output: {
        publicPath: '/',
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },
    target: 'node',
    node: {
        __dirname: false,
        __filename: false
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
};
