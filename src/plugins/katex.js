const { JSDOM } = require("jsdom");

const transformer = async (html) => {
  const dom = new JSDOM(html);

  // Create the CSS link.
  const cssLink = dom.window.document.createElement("link");
  cssLink.setAttribute("rel", "stylesheet");
  cssLink.setAttribute(
    "href",
    "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.css"
  );

  // Create the main dependency script.
  const katexScript = dom.window.document.createElement("script");
  katexScript.setAttribute(
    "src",
    "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/katex.min.js"
  );

  // Create and configure the autoload script.
  const autoLoadScript = dom.window.document.createElement("script");
  autoLoadScript.setAttribute(
    "onload",
    `document.addEventListener("DOMContentLoaded",function(){renderMathInElement(document.body,{delimiters:[{left:"$$",right:"$$",display:!0},{left:"$",right:"$",display:!1}]})});`
  );
  autoLoadScript.setAttribute(
    "src",
    "https://cdn.jsdelivr.net/npm/katex@0.12.0/dist/contrib/auto-render.min.js"
  );

  // Add the scripts to the DOM.
  dom.window.document.head.appendChild(cssLink);
  dom.window.document.body.appendChild(katexScript);
  dom.window.document.body.appendChild(autoLoadScript);

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "KaTeX",
  transformer,
};
