const path = require("path");

module.exports = {
    host: "localhost",
    port: 7702,
    rootPath: (...args) => path.join(__dirname, '..', ...args),
    sourceDir: "src",
    distDir: "dist",
    staticsDir: "public",
    theme: {},
    env: "test" // 可选值: dev, test, pre, online
};