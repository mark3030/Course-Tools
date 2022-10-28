const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackBase = require("./webpack.config.base");
const { sourceDir, distDir, staticsDir, rootPath } = require("./app.config.js");

module.exports = webpackBase(sourceDir, distDir, staticsDir, {
  entry: {
    index: rootPath(sourceDir, "index.jsx"),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: rootPath(staticsDir, "index.html"),
      filename: "index.html"
    }),
    new CopyWebpackPlugin([
      {
        from: rootPath(staticsDir, 'assets'),
        to: rootPath(distDir, 'assets')
      },
      {
        from: rootPath(staticsDir, 'microclass'),
        to: rootPath(distDir, 'microclass')
      }
    ])
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new TerserPlugin({
        sourceMap: false, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            warnings: true, // 去除warning警告
            // drop_debugger: true,// 发布时去除debugger语句
            // drop_console: true, // 发布时去除console语句
            pure_funcs: ['console.log'] // 配置发布时，不被打包的函数
          }
        }
      })
    ]
  }
});