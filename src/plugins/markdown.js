const markdown = require("markdown-it");

const filter = (text, opts) => {
  return markdown({ ...opts }).render(text);
};

module.exports = {
  dependencies: null,
  filter,
  filterName: "markdown",
  name: "Markdown",
  transformer: null,
};
