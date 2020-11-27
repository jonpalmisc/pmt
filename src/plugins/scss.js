const path = require("path");
const sass = require("sass");

const sassOptions = {
  includePaths: [path.join(__dirname, "../../include")],
};

const filter = (data, { filename: file }) => {
  const opts = file.endsWith("scss")
    ? { ...sassOptions, file }
    : { ...sassOptions, data };
  return sass.renderSync(opts).css.toString("utf-8");
};

module.exports = {
  autoEnabled: true,
  filter,
  filterName: "scss",
  name: "SCSS",
  transformer: null,
};
