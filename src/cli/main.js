const fs = require("fs");
const path = require("path");

const engine = require("../engine");
const debug = require("../debug");
const misc = require("../misc");

function handleCompileError(error) {
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
}

async function main(args) {
  global.pmtDebug = args.debug;

  debug("PMT initialized.");

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
    handleCompileError(error);
    return;
  }

  // Determine the correct output path depending on whether it was explicitly
  // provided and what type of output we are producing.
  let outputPath = args.output
    ? args.output
    : misc.replaceExt(args.input, args.html ? ".html" : ".pdf");

  // If the user wants static output, write it now and exit.
  if (args.static) {
    debug("Saving static HTML...");
    fs.writeFileSync(outputPath, staticHtml);
    return;
  }

  // Attempt to load the static HTML into the page and hydrate it.
  try {
    // Get a temporary file path and write our static HTML to it.
    const hydratedPage = await engine.hydrate(
      staticHtml,
      "file:" + inputPath,
      args.timeout
    );

    if (args.html) {
      const finalHtml = await hydratedPage.content();

      debug("Saving hydrated HTML...");
      fs.writeFileSync(outputPath, finalHtml);
    } else {
      // Save hydrated page to PDF.
      debug("Creating PDF via Puppeteer...");
      await hydratedPage.pdf({
        path: outputPath,
        displayHeaderFooter: false,
        printBackground: true,
      });
    }
  } catch (error) {
    console.error("Error: " + error.message);
  }

  await engine.shutdown();
}

module.exports = main;
