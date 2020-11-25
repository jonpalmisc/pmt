const markdown = require("markdown-it");

const dependencies = [];

const filter = (text, opts) => {
  return markdown({ ...opts }).render(text);
};

const filterName = "markdown";

const transformer = (html) => html;

module.exports = {
  dependencies,
  filter,
  filterName,
  transformer,
};
