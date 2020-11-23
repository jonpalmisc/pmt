const fs = require("fs");
const os = require("os");
const path = require("path");

const commandExists = require("command-exists").sync;

function getTempPath(filePath) {
  return path.join(os.tmpdir(), "pdtb_" + path.basename(filePath));
}

// https://github.com/gulpjs/replace-ext/blob/master/index.js
function replaceExt(filePath, ext) {
  const newPath = path.basename(filePath, path.extname(filePath)) + ext;
  return path.join(path.dirname(filePath), newPath);
}

function verifyFileExists(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Couldn't find input file "${inputPath}".`);
  }
}

function verifyCommandExists(backend) {
  if (!commandExists(backend)) {
    throw new Error(
      `Failed to find backend executable "${backend}". Verify it exists or try a different backend.`
    );
  }
}

module.exports = {
  getTempPath,
  replaceExt,
  verifyCommandExists,
  verifyFileExists,
};
