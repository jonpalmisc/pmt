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

  // Write the output (of the correct format) to disk.
  if (args.pdf) {
    let outputPath = args.output
      ? args.output
      : args.input.replace(".pug", ".pdf");

    let htmlPath = outputPath.replace(".pdf", ".html");

    fs.writeFileSync(htmlPath, html);
    cp.execSync(`prince ${htmlPath} -o ${outputPath}`);
  } else {
    let outputPath = args.output
      ? args.output
      : args.input.replace(".pug", ".html");

    fs.writeFileSync(outputPath, html);
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
    });
  // .option("watch", {
  //   alias: "w",
  //   desc: "Trigger recompilation when input changes",
  //   type: "boolean",
  // });
};

require("yargs")
  .version()
  .command(
    "$0 [input] [options]",
    "Create documents (and more) using Pug.",
    mainCommand,
    main
  ).argv;
