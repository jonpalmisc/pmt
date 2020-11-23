const fs = require("fs");
const path = require("path");

const filters = require("./filters");

const prettier = require("prettier");
const pug = require("pug");

function renderFile(inputPath, opts) {
  inputPath = path.resolve(inputPath);

  // Read the input file.
  const input = fs.readFileSync(inputPath, { encoding: "utf-8" });

  // Set up Pug to include our filters, among other things.
  const pugOptions = {
    filename: inputPath,
    filters,
  };

  // Render the input to HTML, optionally formatting it.
  let html = pug.render(input, pugOptions);
  if (opts.pretty) {
    html = prettier.format(html, { parser: "html" });
  }

  return html;
}

module.exports = { renderFile };
