const { JSDOM } = require("jsdom");

// Don't want these to conflict with anything...
const pauseClass = "PAUSE-2e96b2d2-501d-4c5c-a366-86c399d6363d";
const slideClass = "SLIDE-799a24a6-3a63-45f2-98f1-a16153469466";
const groupClass = "GROUP-264847f5-7da0-4b38-8bd6-b0c233d84890";

const pauseTag = `<div class="${pauseClass}"></div>`;

const transformer = async (html) => {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Unlink each slide element from the DOM.
  let slides = Array.from(document.getElementsByClassName(slideClass));

  for (const slide of slides) {
    // This probably isn't needed but makes it easier to order partial slides.
    // TODO: Refactor the code below to remove this.
    const slideGroup = document.createElement("div");
    slideGroup.classList.add(groupClass);

    // Split the slide's HTML string by pause tags.
    const tokens = slide.innerHTML.split(pauseTag);
    for (let i = 0; i < tokens.length; i++) {
      let partialHTML = "";

      // Append the right tokens for each slide.
      for (let j = 0; j < i + 1; j++) {
        partialHTML += tokens[j];
      }

      // Create a new slide element with partial content. It's okay that there
      // are unclosed tags since JSDOM will close them for us.
      const newSlide = document.createElement("div");
      newSlide.classList.add(slideClass);
      newSlide.innerHTML = partialHTML;

      slideGroup.appendChild(newSlide);
    }

    // Remove the original slide and insert the partial slides.
    slide.parentNode.insertBefore(slideGroup, slide.nextSibling);
    slide.remove();
  }

  // Find all slide groups and dissolve them.
  const groups = Array.from(document.getElementsByClassName(groupClass));
  for (let i = 0; i < groups.length; i++) {
    groups[i].outerHTML = groups[i].innerHTML;
  }

  // Find all slide wrappers and dissolve them.
  slides = Array.from(document.getElementsByClassName(slideClass));
  for (let i = 0; i < slides.length; i++) {
    slides[i].outerHTML = slides[i].innerHTML;
  }

  return dom.serialize();
};

module.exports = {
  autoEnabled: false,
  filter: null,
  filterName: null,
  name: "Slides",
  transformer,
};
