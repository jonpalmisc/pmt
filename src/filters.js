const markdown = require("markdown-it");

function markdownFilter(text, opts) {
  return markdown({ ...opts }).render(text);
}

module.exports = {
  markdown: markdownFilter,
};
