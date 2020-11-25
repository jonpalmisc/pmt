const sass = require("node-sass");

const filter = (text, opts) => {
  const file = opts.filename;
  const sassOptions = file.endsWith("scss") ? { file } : { data: text };

  return sass.renderSync(sassOptions).css.toString("utf-8");
};

module.exports = {
  dependencies: null,
  filter,
  filterName: "scss",
  name: "SASS/SCSS",
  transformer: null,
};
