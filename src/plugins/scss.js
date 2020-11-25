const sass = require("node-sass");

const dependencies = [];

const filter = (text, opts) => {
  const file = opts.filename;
  const sassOptions = file.endsWith("scss") ? { file } : { data: text };

  return sass.renderSync(sassOptions).css.toString("utf-8");
};

const filterName = "scss";

const transformer = (html) => html;

module.exports = {
  dependencies,
  filter,
  filterName,
  transformer,
};
