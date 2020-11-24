const fs = require("fs");
const path = require("path");

const filters = require("./filters");

const prettier = require("prettier");
const pug = require("pug");

function renderFile(inputPath, opts) {
  inputPath = path.resolve(inputPath);

  // Read the input file.
  const input = fs.readFileSync(inputPath, { encoding: "utf-8" });

  // Set up Pug to include our filters, among other things.
  const pugOptions = {
    filename: inputPath,
    filters,
  };

  // Render the input to HTML, optionally formatting it.
  let html = pug.render(input, pugOptions);
  if (opts.pretty) {
    html = prettier.format(html, { parser: "html" });
  }

  return html;
}

// This is cursed.
async function waitForIdle(page, maxDuration, maxRequests = 0) {
  page.on("request", requestStarted);
  page.on("requestfinished", requestFinished);
  page.on("requestfailed", requestFinished);

  let inflight = 0;

  let resolve;
  const promise = new Promise((r) => (resolve = r));

  const timeout = setTimeout(timeoutDone, maxDuration);

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
  await page.goto("file:" + filePath, {
    waitUntil: ["load", "domcontentloaded"],
    timeout: 30 * 1000,
  });

  await waitForIdle(page, 200);
}

module.exports = { renderFile, hydrateFile };
