# Carousel.js

A simple touch-enabled HTML5 image carousel, with page indicator
and optional overlay text caption.

[Demo](http://tapengage.github.com/AdTemplates/Carousel/demo/index.html)

## Contents

`src/`

* `Carousel.js` - JavaScript source to setup and activate the Carousel.
* `Carousel.css` - Carousel CSS styles.
* `iscroll.js` - [iScroll](http://cubiq.org/iscroll-4) library dependency.

`build/`

* `Carousel.js` - Built version combining all JS/CSS into a single file.
* `Carousel.min.js` - Minified version (8.1 kb gzipped) using YUI Compressor.

`demo/`

* `index.html` - [Demo page](http://tapengage.github.com/AdTemplates/Carousel/demo/index.html) showing an example carousel.


## Usage

To create a carousel, specify content as HTML markup followed by the Carousel.js script:

```
<div class="Carousel" style="display: none"
data-width="300" data-height="250" data-href="http://www.google.com/images?q=eclipse">
    <span class="Overlay">&#x2190 Swipe to Explore &#x2192</span>
    <ul>
        <li><img src="images/1.jpg"/></li>
        <li><img src="images/2.jpg"/></li>
        <li><img src="images/3.jpg"/></li>
        <li><img src="images/4.jpg"/></li>
        <li><img src="images/5.jpg"/></li>
    </ul>
</div>
<script src=".../Carousel.min.js"></script>
```


### Notes

1. A wrapper `<div>` is required with class "Carousel", and data- attributes
specifying the width/height (in pixels) and target href to open on click.

2. We recommend also setting `style="display: none"` as above to avoid showing
content before the carousel is activated.

3. Carousel items should be included as `<li>` list items in an `<ul>` tag.

4. Include the `Carousel.js` script immediately after the wrapper div.

5. An optional "Overlay" `<span>` can be included to show an overlay caption,
which will fade away when a user first interacts with the carousel.


## Build

The build/ versions of Carousel.js should work out of the box.

However, a Makefile is included if you'd like to modify/build your own.
Just run `make` from the Carousel folder on any Unix-like system (e.g. Mac OS X).
