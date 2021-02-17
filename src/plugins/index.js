const highlight = require("./highlight");
const katex = require("./katex");
const markdown = require("./markdown");
const mermaid = require("./mermaid");
const mathjax = require("./mathjax");
const pages = require("./pages");
const prism = require("./prism");
const quotes = require("./quotes");
const slides = require("./slides");
const scss = require("./scss");

module.exports = [
  highlight,
  katex,
  markdown,
  mathjax,
  mermaid,
  pages,
  prism,
  quotes,
  slides,
  scss,
];
