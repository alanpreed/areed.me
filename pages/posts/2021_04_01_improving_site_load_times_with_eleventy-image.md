---
title: "Improving page load times with eleventy-image"
author: Alan Reed
date: 2021-04-01
description: "A short post, outlining my creation of shortcodes to simplify image insertion.  Using eleventy-image within these, compressed images are generated when the site is built to reduce page load times."
tags: [areed.me, eleventy, web]
layout: layouts/post.njk
---

Having written a few posts for this site, I found that when viewing them on the live site the post pages would take a long time to load. Most of them contained quite a few high-resolution images, and the user experience was somewhat degraded by sitting and watching these slowly render from top to bottom like the output from some ancient printer.

{% figure "A common sight with large embedded images: half-loaded images." %}
{% image  "slow_loading.png" "Example of a half-loaded image." %}
{% endfigure %}

Photos from my camera or my phone range in size from about 1-4MB after processing and cropping, though some can be as large as 10MB. When a page contains multiple images, as posts here are likely to do, they can therefore quickly add up to a fairly hefty download. The simplest fix would be to replace all image files with lower-resolution ones, although it would be a bit of a pain to have to do this manually for every image. I also like having the larger images available on the site for the extra detail that they can provide, so this approach really didn't appeal.

### The solution

The simplest way that I could think of to improve page loading, while also keeping the original images accessible, was to use compressed images in the post pages as hyperlinks that link to the original image files. With this setup the compressed images load quickly on the page, while the original detailed images are still available if required by clicking on the compressed ones.

A priority for this site was to make writing as easy as possible, so there was no way that I wanted a setup where I would have to manually create a compressed copy of every image that I intended to include in all writeups. Fortunately, I was able to avoid this by taking advantage of the Eleventy [image plugin](https://www.11ty.dev/docs/plugins/image/). This can be configured to run whenever Eleventy is used to build the static site, generating and saving a compressed copy of any image provided to it.

Using the Eleventy image plugin requires writing some JavaScript, so it seems to normally be implemented by creating an [Eleventy shortcode](https://www.11ty.dev/docs/shortcodes/) for image insertion. Shortcodes are defined as a function, within which code can be run, and when used in a Markdown file the function's return value (normally a HTML string) will be inserted into the document directly.

Where images are used on this site, I've wrapped them inside a `figure` element so that a caption can be displayed under the image. This requires a bunch of boilerplate HTML that, until now, needed to be pasted in every time. For example, below is the HTML I used to include an image in the first post that I wrote for this site:

{% highlight html %}

<figure>
  <img src={{ image_path | append: "github_setup.png" }} alt="GitHub pages configuration for the site's repository."/>
  <figcaption>GitHub pages configuration for the site's repository.</figcaption>
</figure>

{% endhighlight %}

To make things as simple as possible, when setting up the image plugin I took the opportunity to fold this HTML into a pair of shortcodes at the same time. My `image` shortcode takes an image filename and alt text as inputs, and uses the image plugin to generate an `image` element that displays a compressed version of the image with a link to the original file. The `figure` shortcode is a "paired shortcode", meaning that it has separate start and end tags. This takes a caption as an argument, and wraps everything between its tags inside a `figure` element. This therefore makes it possible to have multiple sub-images per figure, as I have used in previous posts, simply by using multiple `image` shortcodes within one pair of `figure` shortcodes.

Including images in posts is now very simple, and requires writing no HTML. For example, the image featured in this post was added using just the following three lines, most of which consists of the caption and alt-text:

{% highlight markdown %}

{% figure "A common sight with large embedded images: half-loaded images." %}
{% image  "slow_loading.png" "Example of a half-loaded image." %}
{% endfigure %}

{% endhighlight %}

As a bonus, I also added the Eleventy [syntax highlighting plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/) to improve the formatting of the code snippets on this post. Setting this up was simple. After installing the plugin with NPM I had to add two lines to `.eleventy.js` to import it, download a CSS file for the theme (Okaidia), and include this in the base layout file. Usage was also very easy; all that was required was wrapping the code snippets within the `highlight` paired shortcode, including the name of the language to highlight as an argument. The plugin uses PrismJS to generate the formatted code blocks, which supports a [wide range of languages](https://prismjs.com/#languages-list) and should therefore be perfect for any future posts about programming.

Thanks for reading!
