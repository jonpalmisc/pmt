const { JSDOM } = require("jsdom");
const pug = require("pug");

const filter = (text) => {
  return pug.render("div.mermaid #{text}", { text });
};

const transformer = async (html) => {
  const dom = new JSDOM(html);

  // Create the Mermaid.js dependency script.
  const mermaidScript = dom.window.document.createElement("script");
  mermaidScript.setAttribute(
    "src",
    "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"
  );

  // Create another script to initialize Mermaid.js with custom parameters. The
  // parameters below fix flowcharts in Prince!
  const initScript = dom.window.document.createElement("script");
  initScript.text = "mermaid.initialize({ flowchart: { htmlLabels: false } });";

  // Add the scripts to the DOM.
  dom.window.document.body.appendChild(mermaidScript);
  dom.window.document.body.appendChild(initScript);

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter,
  filterName: "mermaid",
  name: "Mermaid",
  transformer: transformer,
};
