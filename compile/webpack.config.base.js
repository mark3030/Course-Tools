const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { merge: WebpackMerge } = require('webpack-merge'); // webpack 5
const { rootPath } = require("./app.config.js");
const { version } = require("../package.json");

module.exports = (src, dist, statics, options) => {
  const srcPath = rootPath(src);
  const distPath = rootPath(dist);
  const isSourceMap = options.devtool === "source-map";
  const isProduction = process.env.NODE_ENV === "production";

  return WebpackMerge({
    mode: process.env.NODE_ENV || "development",
    output: {
      path: distPath,
      filename: `[name]-${version}.js`
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    resolve: {
      extensions: ['.js', '.jsx', '.es', '.css', '.less'],
      alias: {
        '@': rootPath('src'),
        '@common': rootPath('src', 'common'),
        '@components': rootPath('src', 'components'),
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          include: [srcPath],
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"], // 模块
              plugins: [
                "@babel/plugin-transform-runtime",
                ["@babel/plugin-proposal-decorators", { "legacy": true }],
                ["@babel/plugin-proposal-private-methods", { "loose": true }],
                ["@babel/plugin-proposal-private-property-in-object", { "loose": true }],
                ["@babel/plugin-proposal-class-properties", { "loose": true }]
              ] // 插件
            }
          }
        },
        {
          test: /\.(css|less)$/,
          include: [srcPath, rootPath('node_modules')],
          use: [
            isSourceMap ? "style-loader" : MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { sourceMap: isSourceMap } },
            { loader: 'postcss-loader', options: { sourceMap: isSourceMap, postcssOptions: { plugins: [ "postcss-preset-env" ] } } },
            { loader: 'less-loader', options: { sourceMap: isSourceMap, javascriptEnabled: true, modifyVars: {} } }
          ]
        },
        {
          test: /\.(woff|eot|ttf|svg)$/,
          include: [srcPath],
          loader: 'url-loader',
          options: { limit: 10, name: "assets/fonts/[name].[ext]" }
        },
        {
          // 图片加载处理
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          include: [srcPath],
          loader: 'url-loader',
          options: { limit: 1, name: "assets/images/[name].[ext]" }
        },
        {
          test: /\.html$/,
          loader: "html-loader",
          options: { minimize: isProduction }
        }
      ]
    },
    plugins: [
      new SimpleProgressWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `[name]-${version}.css`
      }),
      new CleanWebpackPlugin()
    ]
  }, options);
};