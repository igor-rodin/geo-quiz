const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDevMode = process.env.NODE_ENV === 'development';

module.exports = {
  context: path.resolve(__dirname, './src'),
  entry: './index.js',
  output: {
    clean: true,
    path: path.resolve(__dirname, 'docs'),
    filename: isDevMode ? `js/[name].js` : `js/[name]-[contenthash:7].js`,
    assetModuleFilename: isDevMode ? `images/[name][ext]` : `images/[name]-[contenthash:7][ext][query]`,
  },
  devServer: {
    contentBase: path.resolve(__dirname, './docs'),
    index: 'index.html',
    hot: true,
    port: 8000
  },
  devtool: isDevMode ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            // plugins: ["@babel/plugin-transform-runtime"]
          }
        }
      },
      {
        test: /\.(s[ac]|c)ss/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "" }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resourse'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      title: 'Геоотзыв',
      template: './index.html',
    }),
  ]
}