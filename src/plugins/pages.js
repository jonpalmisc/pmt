const { JSDOM } = require("jsdom");

const transformer = async (html) => {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Create the main dependency script.
  const pagesScript = document.createElement("script");
  pagesScript.setAttribute(
    "src",
    "https://unpkg.com/pagedjs/dist/paged.polyfill.js"
  );

  // Add the scripts to the DOM.
  document.body.appendChild(pagesScript);

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "Pages",
  transformer,
};
