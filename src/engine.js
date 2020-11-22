const fs = require("fs");

const filters = require("./filters");

const prettier = require("prettier");
const pug = require("pug");

const pugOptions = {
  filters,
};

function renderFile(path, opts) {
  const input = fs.readFileSync(path, { encoding: "utf-8" });

  // Render the input to HTML, optionally formatting it.
  let html = pug.render(input, pugOptions);
  if (opts.pretty) {
    html = prettier.format(html, { parser: "html" });
  }

  return html;
}

module.exports = { renderFile };
