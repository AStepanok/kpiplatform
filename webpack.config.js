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
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    }
};
