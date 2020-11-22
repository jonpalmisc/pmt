const cp = require("child_process");
const fs = require("fs");

const engine = require("./engine");

const main = (args) => {
  // Make sure the input path exists.
  if (!fs.existsSync(args.input)) {
    console.error(`Could not find input file "${args.input}".`);
    console.error(
      "Are you passing an input path explicitly? See --help for more info."
    );
    return;
  }

  const html = engine.renderFile(args.input, { pretty: args.pretty });

  // Configure the output path.
  let htmlPath = args.input.replace(".pug", ".html");
  let outputPath = htmlPath.replace(".html", ".pdf");
  if (args.output) {
    outputPath = args.output;
  }

  // Write the output to disk.
  fs.writeFileSync(htmlPath, html);

  // If PDF output is desired, run the HTML output through Prince.
  if (args.pdf) {
    cp.execSync(`prince ${htmlPath} -o ${outputPath}`);
  }
};

const mainCommand = (yargs) => {
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
    .option("pdf", {
      alias: "p",
      desc: "Produce a PDF with Prince",
      type: "boolean",
    })
    .option("pretty", {
      alias: "P",
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
    mainCommand,
    main
  ).argv;
