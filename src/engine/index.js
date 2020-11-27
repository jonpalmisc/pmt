const { compile } = require("./compiler");
const { hydrate, shutdown } = require("./hydrator");

module.exports = { compile, hydrate, shutdown };
