const { JSDOM } = require("jsdom");

const transformer = async (html) => {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Create the main dependency script.
  const prismScript = document.createElement("script");
  prismScript.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/components/prism-core.min.js"
  );

  const autoloadScript = document.createElement("script");
  autoloadScript.setAttribute(
    "src",
    "https://cdnjs.cloudflare.com/ajax/libs/prism/1.23.0/plugins/autoloader/prism-autoloader.min.js"
  );

  // Add the scripts to the DOM.
  document.body.appendChild(prismScript);
  document.body.appendChild(autoloadScript);

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "Prism",
  transformer,
};
