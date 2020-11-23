const cp = require("child_process");
const fs = require("fs");

const engine = require("./engine");

const commandExists = require("command-exists").sync;

function verifyInput(inputPath) {
  if (!fs.existsSync(inputPath)) {
    throw new Error(`Couldn't find input file "${inputPath}".`);
  }
}

function verifyBackend(backend) {
  if (!commandExists(backend)) {
    throw new Error(
      `Failed to find backend executable "${backend}". Verify it exists or try a different backend.`
    );
  }
}

const main = (args) => {
  try {
    verifyInput(args.input);
    verifyBackend(args.backend);
  } catch (error) {
    console.error(error.message);
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
    cp.execSync(`${args.backend} ${htmlPath} -o ${outputPath}`);
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
