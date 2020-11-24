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

  let tempPath = misc.getTempPath(misc.replaceExt(args.input, ".html"));

  fs.writeFileSync(tempPath, html);

  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();

  page
    .on("pageerror", (error) => {
      console.error("PAGE ERROR: " + error.message);
    })
    .on("error", (error) => {
      console.error("ERROR: " + error.message);
    });

  try {
    await page.goto("file:" + tempPath, {
      waitUntil: ["load", "domcontentloaded"],
      timeout: 30 * 1000,
    });
  } catch (error) {
    console.error(error);
  }

  // await waitForNetworkIdle(page, 200);

  const finalHtml = await page.content();

  browser.close();

  // TODO: Re-add PDF support.
  fs.writeFileSync(outputPath, finalHtml);
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
    async (args) => {
      await main(args);
    }
  ).argv;
