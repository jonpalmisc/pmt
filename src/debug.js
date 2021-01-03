let firstTimestamp = null;

module.exports = function (message) {
  if (!global.pmtDebug) {
    return;
  }

  if (firstTimestamp == null) {
    firstTimestamp = Date.now();
  }

  let delta = Date.now() - firstTimestamp;
  delta = ("+" + delta).padStart(6, " ") + " ms";

  console.log(`DEBUG | ${delta} | ${message}`);
};
