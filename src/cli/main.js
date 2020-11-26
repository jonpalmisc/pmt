const cp = require("child_process");
const fs = require("fs");
const path = require("path");

const engine = require("../engine");
const debug = require("../debug");
const misc = require("../misc");

const puppeteer = require("puppeteer");

const puppeteerConfig = {
  headless: true,
  args: ["--disable-translate", "--disable-extensions", "--disable-sync"],
};

async function main(args) {
  global.pdtDebug = args.debug;

  debug("PDT initialized.");

  debug("Checking if input file exists...");
  if (!fs.existsSync(args.input)) {
    console.log(`Error: Couldn't find input file "${args.input}".`);
    return;
  }

  // Read the input file.
  debug("Reading input...");
  const inputPath = path.resolve(args.input);
  const pugString = fs.readFileSync(inputPath, { encoding: "utf-8" });

  // Attempt to dender the input to HTML; show errors and stop if needed.
  let staticHtml = null;
  try {
    staticHtml = await engine.compile(pugString, {
      inputPath,
      enabledPlugins: args.plugins,
    });
  } catch (error) {
    // Handle Pug-related errors a little more gracefully.
    if (error.code && error.code.startsWith("PUG")) {
      console.error(
        `Error: Failed to compile Pug. (${error.msg}, ${error.filename}:${error.line})`
      );

      // Show hint for missing filter errors.
      if (error.code == "PUG:UNKNOWN_FILTER") {
        console.error("Hint: Did you forget to enable a plugin?");
      }
    } else {
      console.error("Error: " + error.message);
    }

    return;
  }

  // Determine the correct output path depending on whether it was explicitly
  // provided and what type of output we are producing.
  let outputPath = args.output
    ? args.output
    : misc.replaceExt(args.input, args.html ? ".html" : ".pdf");

  // If the user wants static output, write it now and exit.
  if (args.static) {
    fs.writeFileSync(outputPath, staticHtml);
    return;
  }

  // Get a temporary file path and write our static HTML to it.
  let tempPath = misc.getTempPath(misc.replaceExt(args.input, ".html"));

  debug(`Writing compiled HTML to disk temporarily... (${tempPath})`);
  fs.writeFileSync(tempPath, staticHtml);

  // Start a headless browser and create a new page.
  debug("Initializing headless browser...");
  const browser = await puppeteer.launch(puppeteerConfig);
  const page = await browser.newPage();

  // Attempt to load the static HTML into the page and hydrate it.
  try {
    await engine.hydrateFile(page, tempPath);
  } catch (error) {
    console.error("Error: " + error.message);
    return;
  }

  if (args.html) {
    const finalHtml = await page.content();

    debug("Closing browser and saving hydrated HTML...");
    fs.writeFileSync(outputPath, finalHtml);
    browser.close();
    return;
  }

  try {
    await engine.makePdf(page, outputPath, "internal");
  } catch (error) {
    console.error("Error: " + error.message);
  }

  // Remove temporary HTML and close the browser.
  debug(`Removing temporary HTML file... (${tempPath})`);
  fs.unlinkSync(tempPath);
  browser.close();

  debug("Done!");
}

module.exports = main;
