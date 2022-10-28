const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpackBase = require("./webpack.config.base");
const { host, port, sourceDir, distDir, staticsDir, rootPath, env } = require("./app.config.js");

module.exports = webpackBase(sourceDir, distDir, staticsDir, {
  devtool: 'source-map',
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
      }
    ])
  ],
  devServer: {
    compress: true,
    host,
    port,
    // inline: true,
    hot: true,
    // open: true,
    // disableHostCheck: true,
    // historyApiFallback: true, // using html5 router.
    static: rootPath(staticsDir),
    proxy: {
      "/api": `https://chat-${env}.dtedu.com`,
      "/dt-ecampus": {
        target: `https://platform-${env}.dtedu.com`,
        secure: true,
        changeOrigin: true
      },
      "/dt-platform": {
        target: `https://platform-${env}.dtedu.com`,
        secure: true,
        changeOrigin: true
      },
      "/file": {
        target: `https://platform-${env}.dtedu.com`,
        secure: true,
        changeOrigin: true
      }
    }
  }
});