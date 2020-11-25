const mathjaxPage = require("mathjax-node-page").mjpage;

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
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "MathJax",
  transformer,
};
