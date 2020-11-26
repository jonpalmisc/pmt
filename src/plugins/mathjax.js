const mathjax = require("mathjax-full");

const transformer = async (html) => {
  const mj = await mathjax.init({
    loader: {
      load: ["adaptors/liteDOM", "tex-chtml"],
    },
    tex: {
      packages: ["base", "autoload", "require", "ams", "newcommand"],
      inlineMath: [["$", "$"]],
    },
    "adaptors/liteDOM": {
      fontSize: 16,
    },
    chtml: {
      fontURL:
        "https://cdn.jsdelivr.net/npm/mathjax@3/es5/output/chtml/fonts/woff-v2",
      exFactor: 0.5,
    },
    startup: {
      document: html,
    },
  });

  const adaptor = mj.startup.adaptor;
  const output = mj.startup.document;

  return adaptor.outerHTML(adaptor.root(output.document));
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "MathJax",
  transformer,
};
