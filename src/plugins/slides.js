const { JSDOM } = require("jsdom");

const pauseClass = "PAUSE-2e96b2d2-501d-4c5c-a366-86c399d6363d";
const slideClass = "SLIDE-799a24a6-3a63-45f2-98f1-a16153469466";
const cursorClass = "CURSOR-df4362b0-724e-472a-b639-a73876728fc8";
const groupClass = "GROUP-264847f5-7da0-4b38-8bd6-b0c233d84890";

const focusClass = "PMT__slides__focused-element";

function getNextSiblings(element, filter) {
  let siblings = [];

  while ((element = element.nextSibling)) {
    if (element.nodeType === 3) {
      continue;
    }

    if (!filter || filter(element)) {
      siblings.push(element);
    }
  }

  return siblings;
}

const transformer = async (html) => {
  const dom = new JSDOM(html);
  const { document } = dom.window;

  // Unlink each slide element from the DOM.
  let slides = Array.from(document.getElementsByClassName(slideClass));

  for (const slide of slides) {
    // This probably isn't needed but makes it easier to order partial slides.
    const slideGroup = document.createElement("div");
    slideGroup.classList.add(groupClass);

    // Split the slide's HTML string by pause tags.
    const slideHTML = slide.innerHTML;
    const pauseTag = `<div class="${pauseClass}"></div>`;
    const tokens = slideHTML.split(pauseTag);
    for (let i = 0; i < tokens.length; i++) {
      let trimmedHTML = "";

      for (let j = 0; j < i + 1; j++) {
        // If this is the last fragment, place the cursor mark before it.
        if (j == i) {
          trimmedHTML += `<div class="${cursorClass}"></div>`;
        }

        trimmedHTML += tokens[j];
      }

      // Create a new slide element with partial content. It is okay that there
      // are unclosed tags since JSDOM will close them for us.
      const newSlide = document.createElement("div");
      newSlide.classList.add(slideClass);
      newSlide.innerHTML = trimmedHTML;

      slideGroup.appendChild(newSlide);
    }

    // Remove the original slide and insert the partial slides.
    slide.parentNode.insertBefore(slideGroup, slide.nextSibling);
    slide.remove();
  }

  // Select all partial slide wrappers and dissolve them.
  const groups = Array.from(document.getElementsByClassName(groupClass));
  for (let i = 0; i < groups.length; i++) {
    groups[i].replaceWith(...groups[i].childNodes);
  }

  // Apply current item classes and dissolve slide wrappers.
  slides = Array.from(document.getElementsByClassName(slideClass));
  for (let i = 0; i < slides.length; i++) {
    const cursor = slides[i].getElementsByClassName(cursorClass)[0];

    // Apply the "current item" class to the elements after the cursor.
    const nextSiblings = getNextSiblings(cursor);
    for (const sibling of nextSiblings) {
      sibling.classList.add(focusClass);
    }

    // Dissolve the slide class.
    slides[i].replaceWith(...slides[i].childNodes);
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
