const cp = require("child_process");
const fs = require("fs");

const engine = require("./engine");
const misc = require("./misc");

const main = (args) => {
  try {
    misc.verifyFileExists(args.input);
    misc.verifyCommandExists(args.backend);
  } catch (error) {
    console.error(error.message);
    return;
  }

  // Render the input to HTML; format it if HTML is our output format.
  const html = engine.renderFile(args.input, { pretty: !args.pdf });

  // Determine the correct output path depending on whether it was explicitly
  // provided and what type of output we are producing.
  let outputPath = args.output
    ? args.output
    : misc.replaceExt(args.input, args.pdf ? ".pdf" : ".html");

  // Write the output (of the correct format) to disk. If we are doing PDF
  // output, write the HTML to a temporary folder to avoid clutter and
  // unnecessary activity on network/cloud drives.
  if (args.pdf) {
    let htmlPath = misc.getTempPath(misc.replaceExt(args.input, ".html"));

    fs.writeFileSync(htmlPath, html);
    cp.execSync(`${args.backend} ${htmlPath} -o ${outputPath}`);
  } else {
    fs.writeFileSync(outputPath, html);
  }
};

const mainCommand = (yargs) => {
  yargs
    .alias("h", "help")
    .alias("v", "version")
    .positional("input", {
      describe: "The input file to process",
      type: "string",
      default: "main.pug",
    })
    .option("backend", {
      alias: "b",
      describe: "The HTML to PDF converter to use",
      default: "prince",
      type: "string",
    })
    .option("output", {
      alias: "o",
      desc: "The desired output path",
      type: "string",
    })
    .option("pdf", {
      alias: "p",
      desc: "Produce additional PDF output",
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
