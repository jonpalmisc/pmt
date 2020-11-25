const mathjaxPage = require("mathjax-node-page").mjpage;

const dependencies = null;

const filter = null;

const filterName = null;

const name = "MathJax";

const transformer = async (html) => {
  return new Promise((resolve) => {
    mathjaxPage(
      html,
      {
        format: ["TeX"],
        singleDollars: true,
      },
      {
        mml: true,
        css: true,
        html: true,
      },
      (output) => resolve(output)
    );
  });
};

module.exports = {
  dependencies,
  filter,
  filterName,
  name,
  transformer,
};
