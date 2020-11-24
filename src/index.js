const cp = require("child_process");
const fs = require("fs");

const engine = require("./engine");
const misc = require("./misc");

const puppeteer = require("puppeteer");

const puppeteerConfig = {
  headless: true,
  args: ["--disable-translate", "--disable-extensions", "--disable-sync"],
};

async function main(args) {
  try {
    misc.verifyFileExists(args.input);
    // misc.verifyCommandExists(args.backend);
  } catch (error) {
    console.error("Error: " + error.message);
    return;
  }

  // Render the input to HTML; format it if HTML is our output format.
  const staticHtml = engine.renderFile(args.input, { pretty: false });

  // Determine the correct output path depending on whether it was explicitly
  // provided and what type of output we are producing.
  let outputPath = args.output
    ? args.output
    : misc.replaceExt(args.input, args.pdf ? ".pdf" : ".html");

  // Get a temporary file path and write our static HTML to it.
  let tempPath = misc.getTempPath(misc.replaceExt(args.input, ".html"));
  fs.writeFileSync(tempPath, staticHtml);

  // Start a headless browser and create a new page.
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();

  // Attempt to load the static HTML into the page and hydrate it.
  try {
    await engine.hydrateFile(page, tempPath);
  } catch (error) {
    console.error("Error: " + error.message);
    return;
  }

  if (!args.pdf) {
    const finalHtml = await page.content();

    browser.close();
    fs.writeFileSync(outputPath, finalHtml);
    return;
  }

  try {
    await engine.makePdf(page, outputPath, "internal");
  } catch (error) {
    console.error("Error: " + error.message);
  }

  // Remove temporary HTML and close the browser.
  fs.unlinkSync(tempPath);
  browser.close();
}

const mainCommand = (yargs) => {
  yargs
    .alias("h", "help")
    .alias("v", "version")
    .positional("input", {
      describe: "The input file to process",
      type: "string",
      default: "main.pug",
    })
    // .option("backend", {
    //   alias: "b",
    //   describe: "The HTML to PDF converter to use",
    //   default: "internal",
    //   type: "string",
    // })
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
    async (args) => {
      await main(args);
    }
  ).argv;
