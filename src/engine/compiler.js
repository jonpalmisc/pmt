const pug = require("pug");

const allPlugins = require("../plugins");
const debug = require("../debug");

function getPlugins(enableList) {
  enableList = enableList.map((p) => p.toLowerCase());

  const plugins = allPlugins.filter(
    (p) => p.autoEnabled || enableList.includes(p.name.toLowerCase())
  );

  plugins.forEach((p) => debug(`Enabling ${p.name} plugin...`));

  return plugins;
}

async function compile(pugString, options) {
  // Get the default and user-enabled plugins.
  const plugins = getPlugins(options.enabledPlugins);

  // Set up Pug to include our filters, among other things.
  const pugOptions = {
    filename: options.inputPath,
    filters: Object.assign(
      {},
      ...plugins.map((p) => ({ [p.filterName]: p.filter }))
    ),
  };

  // Render the input to HTML, optionally formatting it.
  debug("Compiling...");
  let html = pug.render(pugString, pugOptions);

  // Apply all of our plugin transformers.
  const transformerPlugins = plugins.filter((p) => p.transformer != null);
  for (const p of transformerPlugins) {
    debug(`Applying transformer for ${p.name} plugin...`);

    html = await p.transformer(html);
  }

  return html;
}

module.exports = { compile };
