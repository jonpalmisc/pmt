const markdown = require("markdown-it");

const filter = (text, opts) => {
  return markdown({ ...opts }).render(text);
};

module.exports = {
  autoEnabled: true,
  dependencies: null,
  filter,
  filterName: "markdown",
  name: "Markdown",
  transformer: null,
};
