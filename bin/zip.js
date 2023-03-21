#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const sh = require("shelljs");
const { name, version } = require("../package.json");

const rootPath = (...args) => path.join(__dirname, '..', ...args);

const zip = (src, dest) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(dest);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output
      .on("close", () => {
        console.info(archive.pointer() + " total bytes");
        console.info("archiver has been finalized and the output file descriptor has closed.");
        resolve();
      })
      .on("end", () => console.info("Data has been drained"));

    archive
      .on("warning", err => {
        if (err.code === "ENOENT") {
          console.warn(err);
        } else {
          reject(err);
        }
      })
      .on("entry", entry => console.info('adding:', entry.name))
      .on("error", err => reject(err));

    archive.pipe(output);
    archive.directory(`${src}/`, '');
    archive.finalize();
  });
};

const [nodePath, scriptName, dist = 'releases', src = 'build', platform = 'darwin'] = process.argv;
const dirname = `${name}-${platform}-x64`;
let output = '', source = '';

if (dist && src && platform) {
  output = rootPath(dist, version, `${dirname}-${version}.zip`);
  source = rootPath(src, dirname);
  source = fs.existsSync(source) ? source : rootPath(src);
  if(fs.existsSync(source)) {
    fs.mkdirSync(rootPath(dist, version), { recursive: true });
    zip(source, output);
  } else {
    console.error('参数不正确!');
  }
} else {
  console.error('参数不正确!');
}