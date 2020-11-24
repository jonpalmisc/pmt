function debug(message) {
  console.log("[debug] " + message);
}

let firstTimestamp = null;

module.exports = function (message) {
  if (!global.pdtDebug) {
    return;
  }

  if (firstTimestamp == null) {
    firstTimestamp = Date.now();
  }

  let delta = Date.now() - firstTimestamp;
  delta = ("+" + delta).padStart(6, " ") + " ms";

  console.log(`debug | ${delta} | ${message}`);
};
