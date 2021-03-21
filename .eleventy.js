const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const eleventyImage = require("@11ty/eleventy-img");
const { format } = require("date-fns");
const lodashChunk = require("lodash.chunk");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(eleventyNavigationPlugin);

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("favicon.png");

  // Avoids page tags overwriting layout tags
  eleventyConfig.setDataDeepMerge(true);

  // Reformat date using date-fns for display
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return format(dateObj, "dd/MM/yyyy");
  });

  // Removes posts from list of tags
  eleventyConfig.addFilter("removePostsTag", (tags) => {
    if (tags[0] == "posts") {
      return tags.slice(1);
    } else {
      return tags;
    }
  });

  // Format post image file string
  eleventyConfig.addFilter("formatImagePath", (date, fileName) => {
    return "/images/" + format(date, "yyyy-MM-dd") + "/" + fileName;
  });

  // Create collection of all post tags
  eleventyConfig.addCollection("allTags", (collection) => {
    const tagsSet = new Set();
    collection.getAll().forEach((item) => {
      if (!item.data.tags) return;
      item.data.tags
        .filter((tag) => !["posts", "all"].includes(tag))
        .forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  });

  // From https://github.com/11ty/eleventy/issues/332#issuecomment-445236776
  // Double pagination to allow page numbers on tag pages
  eleventyConfig.addCollection("doublePagination", function (collection) {
    // Get unique list of tags
    let tagSet = new Set();
    collection.getAllSorted().map(function (item) {
      if ("tags" in item.data) {
        item.data.tags
          .filter((tag) => !["posts", "all"].includes(tag))
          .forEach((tag) => tagSet.add(tag));
      }
    });

    // Get each item that matches the tag
    let paginationSize = 10; // TODO: make global config
    let tagMap = [];
    let tagArray = [...tagSet];

    for (let tagName of tagArray) {
      let tagItems = collection.getFilteredByTag(tagName);
      let pagedItems = lodashChunk(tagItems, paginationSize);

      // console.log( tagName, tagItems.length, pagedItems.length );
      for (
        let pageNumber = 0, max = pagedItems.length;
        pageNumber < max;
        pageNumber++
      ) {
        tagMap.push({
          tagName: tagName,
          pageNumber: pageNumber + 1, // Index the pagenumber from 1 to make link generation easier
          totalPages: max,
          pageData: pagedItems[pageNumber],
        });
      }
    }
    // console.log(tagMap);
    return tagMap;
  });

  // Template for img element insertion, which also handles generation of smaller images to improve page loading
  eleventyConfig.addLiquidShortcode(
    "image",
    function (imageName, caption, imgFormat = "jpeg") {
      let basePath = "images/" + format(this.page.date, "yyyy-MM-dd") + "/";
      let inputFilePath = "./" + basePath + imageName;

      let options = {
        widths: [600],
        formats: [imgFormat],
        outputDir: "./" + basePath + "generated/",
        urlPath: "/" + basePath + "generated/",
      };

      eleventyImage(inputFilePath, options);
      metadata = eleventyImage.statsSync(inputFilePath, options);

      let data = metadata[imgFormat][0];

      return `<div class="column">
  <a class="a-img" href=${"/" + basePath + imageName} target="_blank">
    <img src=${data.url} }}  alt="${caption}" >
  </a>
</div>`;
    }
  );

  // Template for figure element insertion
  eleventyConfig.addPairedLiquidShortcode(
    "figure",
    function (figureContent, caption) {
      return `<figure>
  <div class="row">
    ${figureContent}
  </div>
  <figcaption>${caption}</figcaption>
</figure>`;
    }
  );

  return {
    dir: {
      input: "pages",
      output: "docs",
    },
  };
};
