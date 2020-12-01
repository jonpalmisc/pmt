const main = require("./main");

const config = (yargs) => {
  yargs
    .alias("h", "help")
    .alias("v", "version")
    .positional("input", {
      describe: "The file to process",
      type: "string",
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
    })
    .option("timeout", {
      alias: "t",
      desc: "Maximum time allowed (in seconds) for hydration",
      type: "number",
      default: 15,
    });
};

require("yargs")
  .parserConfiguration({
    "short-option-groups": true,
  })
  .version()
  .command(
    "$0 <input> [options]",
    "A robust solution for creating PDF media with Pug.",
    config,
    main
  ).argv;
