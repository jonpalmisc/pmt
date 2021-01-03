const os = require("os");
const path = require("path");

function getTempPath(filePath) {
  return path.join(os.tmpdir(), "pmt_" + path.basename(filePath));
}

// https://github.com/gulpjs/replace-ext/blob/master/index.js
function replaceExt(filePath, ext) {
  const newPath = path.basename(filePath, path.extname(filePath)) + ext;
  return path.join(path.dirname(filePath), newPath);
}

module.exports = {
  getTempPath,
  replaceExt,
};
