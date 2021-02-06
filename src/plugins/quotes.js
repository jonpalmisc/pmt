const { JSDOM } = require("jsdom");

const transformer = async (html) => {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Create the main dependency script.
  const sqScript = document.createElement("script");
  sqScript.setAttribute(
    "src",
    "https://cdn.jsdelivr.net/gh/kellym/smartquotes.js@master/dist/smartquotes.js"
  );

  // Create and configure the autoload script.
  const runScript = document.createElement("script");
  runScript.innerHTML = "smartquotes();";

  // Add the scripts to the DOM.
  document.body.appendChild(sqScript);
  document.body.appendChild(runScript);

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "Quotes",
  transformer,
};
