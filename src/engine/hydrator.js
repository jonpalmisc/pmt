const debug = require("../debug");

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

module.exports = { hydrateFile, makePdf };
