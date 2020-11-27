const fs = require("fs");

const debug = require("../debug");

const puppeteer = require("puppeteer");

const puppeteerConfig = {
  headless: true,
  args: ["--disable-translate", "--disable-extensions", "--disable-sync"],
};

let browser = null;

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

async function hydrate(staticHtml, tempPath, timeout) {
  debug(`Writing compiled HTML to disk temporarily... (${tempPath})`);
  fs.writeFileSync(tempPath, staticHtml);

  // Initialize our browser if it isn't already. This will become relevant once
  // file watching is eventually implemented to avoid creating 2+ browsers.
  if (browser == null) {
    debug("Initializing headless browser...");
    browser = await puppeteer.launch(puppeteerConfig);
  }

  const page = await browser.newPage();

  debug("Hydrating static HTML...");
  await page.goto("file:" + tempPath, {
    waitUntil: ["load", "domcontentloaded"],
    timeout: timeout ? timeout : 30 * 1000,
  });

  await waitForIdle(page, 200);

  return page;
}

async function shutdown() {
  debug("Shutting down browser...");
  await browser.close();
}

module.exports = { hydrate, shutdown };
