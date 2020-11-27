const main = require("./main");

const config = (yargs) => {
  yargs
    .alias("h", "help")
    .alias("v", "version")
    .positional("input", {
      describe: "The file to process",
      type: "string",
      default: "main.pug",
    })
    .option("debug", {
      alias: "d",
      desc: "Show debug and performance info",
      type: "boolean",
    })
    .option("keep-temp", {
      alias: "K",
      desc: "Disable removal of temporary files",
      type: "boolean",
    })
    .option("output", {
      alias: "o",
      desc: "Write output to a specific path",
      type: "string",
    })
    .option("html", {
      alias: "x",
      desc: "Produce HTML for use with another program",
      type: "boolean",
    })
    .option("plugins", {
      alias: "p",
      desc: "Enable the specified plugins",
      type: "array",
      default: [],
    })
    .option("static", {
      alias: "S",
      desc: "Skip page hydration",
      type: "boolean",
      implies: "html",
    });
};

require("yargs")
  .parserConfiguration({
    "short-option-groups": true,
  })
  .version()
  .command(
    "$0 [input] [options]",
    "Create documents (and more) using Pug.",
    config,
    main
  ).argv;
