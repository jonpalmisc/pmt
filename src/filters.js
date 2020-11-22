const markdownEngine = require("markdown-it");

function markdown(text, opts) {
  return markdownEngine({ ...opts }).render(text);
}

module.exports = {
  markdown,
};
