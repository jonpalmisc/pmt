const fs = require("fs");

const prettier = require("prettier");
const pug = require("pug");

function main(args) {
  // Make sure the input path exists.
  if (!fs.existsSync(args.input)) {
    console.error(`Could not find input file "${args.input}".`);
    console.error(
      "Are you passing an input path explicitly? See --help for more info."
    );
    return;
  }

  const input = fs.readFileSync(args.input, { encoding: "utf-8" });

  // Render the input to HTML, optionally formatting it.
  let html = pug.render(input);
  if (args.pretty) {
    html = prettier.format(html, { parser: "html" });
  }

  // Configure the output path.
  let outputPath = args.input.replace(".pug", ".html");
  if (args.output) {
    outputPath = args.output;
  }

  // Write the output to disk.
  fs.writeFileSync(outputPath, html);
}

const mainBuilder = (yargs) => {
  yargs
    .positional("input", {
      describe: "The input file to process",
      type: "string",
      default: "main.pug",
    })
    .option("output", {
      alias: "o",
      desc: "The desired output path",
      type: "string",
    })
    .option("pretty", {
      alias: "p",
      desc: "Format the output with Prettier",
      type: "boolean",
    })
    .option("watch", {
      alias: "w",
      desc: "Trigger recompilation when input changes",
      type: "boolean",
    });
};

require("yargs")
  .version()
  .command(
    "$0 [input] [options]",
    "Create documents (and more) using Pug.",
    mainBuilder,
    main
  ).argv;
