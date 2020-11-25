const fs = require("fs");
const path = require("path");

const debug = require("./debug");
const plugins = require("./plugins");

const pug = require("pug");

async function renderFile(inputPath) {
  inputPath = path.resolve(inputPath);

  // Read the input file.
  debug("Reading input...");
  const input = fs.readFileSync(inputPath, { encoding: "utf-8" });

  const filters = Object.assign(
    {},
    ...plugins.map((p) => ({ [p.filterName]: p.filter }))
  );

  // Set up Pug to include our filters, among other things.
  const pugOptions = {
    filename: inputPath,
    filters,
  };

  // Render the input to HTML, optionally formatting it.
  debug("Compiling...");
  let html = pug.render(input, pugOptions);

  // Apply all of our plugin transformers.
  const transformerPlugins = plugins.filter((p) => p.transformer != null);
  for (const p of transformerPlugins) {
    debug(`Applying transformer for ${p.name} plugin...`);

    html = await p.transformer(html);
  }

  return html;
}

// This is cursed.
async function waitForIdle(page, maxDuration, maxRequests = 0) {
  debug("Waiting for idle...");

  page.on("request", requestStarted);
  page.on("requestfinished", requestFinished);
  page.on("requestfailed", requestFinished);

  let inflight = 0;

  let resolve;
  const promise = new Promise((r) => (resolve = r));

  let timeout = setTimeout(timeoutDone, maxDuration);

  return promise;

  function timeoutDone() {
    page.removeListener("request", requestStarted);
    page.removeListener("requestfinished", requestFinished);
    page.removeListener("requestfailed", requestFinished);

    resolve();
  }

  function requestStarted() {
    ++inflight;

    if (inflight > maxRequests) {
      clearTimeout(timeout);
    }
  }

  function requestFinished() {
    if (inflight == 0) {
      return;
    }

    --inflight;

    if (inflight === maxRequests) {
      timeout = setTimeout(timeoutDone, maxDuration);
    }
  }
}

async function hydrateFile(page, filePath) {
  debug("Hydrating static HTML...");

  await page.goto("file:" + filePath, {
    waitUntil: ["load", "domcontentloaded"],
    timeout: 30 * 1000,
  });

  await waitForIdle(page, 200);
}

async function makePdfInternal(page, outputPath) {
  debug("Creating PDF via Puppeteer...");
  await page.pdf({
    path: outputPath,
    displayHeaderFooter: false,
    printBackground: true,
  });
}

async function makePdf(page, outputPath, backend) {
  if (backend == "internal") {
    await makePdfInternal(page, outputPath);
  } else {
    throw new Error(`Backend "${backend}" is not supported.`);
  }
}

module.exports = { makePdf, renderFile, hydrateFile };
