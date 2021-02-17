const { JSDOM } = require("jsdom");

const transformer = async (html) => {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Create the main dependency script.
  const highlightScript = document.createElement("script");
  highlightScript.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.5.0/highlight.min.js"
  );

  const initScript = dom.window.document.createElement("script");
  initScript.text = "hljs.initHighlightingOnLoad();";

  // Add the scripts to the DOM.
  document.body.appendChild(highlightScript);
  document.body.appendChild(initScript);

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "Highlight",
  transformer,
};
