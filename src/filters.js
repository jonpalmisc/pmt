const markdown = require("markdown-it");
const sass = require("node-sass");

function markdownFilter(text, opts) {
  return markdown({ ...opts }).render(text);
}

// https://pugjs.org/language/includes.html#including-filtered-text
function scssFilter(text, opts) {
  const file = opts.filename;
  const sassOptions = file.endsWith("scss") ? { file } : { data: text };

  return sass.renderSync(sassOptions).css.toString("utf-8");
}

module.exports = {
  markdown: markdownFilter,
  scss: scssFilter,
};
