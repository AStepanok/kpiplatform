var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: ['@babel/polyfill', './src/client/index.tsx']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.css']
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs|ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ['css-loader']
            }
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.hbs',
            template: require.resolve(
                './src/server/routes/page/index.html.ejs'
            ),
            alwaysWriteToDisk: true,
            inject: false,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            }
        })
    ]
};
