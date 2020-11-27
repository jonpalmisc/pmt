const sass = require("sass");

const filter = (text, opts) => {
  const file = opts.filename;
  const sassOptions = file.endsWith("scss") ? { file } : { data: text };

  return sass.renderSync(sassOptions).css.toString("utf-8");
};

module.exports = {
  autoEnabled: true,
  filter,
  filterName: "scss",
  name: "SCSS",
  transformer: null,
};
