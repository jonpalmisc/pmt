const katex = require("./katex");
const markdown = require("./markdown");
const mermaid = require("./mermaid");
const mathjax = require("./mathjax");
const pages = require("./pages");
const quotes = require("./quotes");
const slides = require("./slides");
const scss = require("./scss");

module.exports = [
  katex,
  markdown,
  mathjax,
  mermaid,
  pages,
  quotes,
  slides,
  scss,
];
