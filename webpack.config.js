const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: "development",
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'main.js',
      publicPath: '/',
    },
    plugins: [
        new HtmlWebpackPlugin(
            {
                template: './src/index.html',
            }
        ),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader'
                }
              },
              {
                test: /\.html$/,
                use: "html-loader"
              },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
      },
};
