# Carousel.js

A simple touch-enabled HTML5 image carousel.

[Demo](http://tapengage.github.com/AdTemplates/Carousel/demo/index.html)

# Contents

src/
    Javascript/CSS source code, including the iScroll.js library.
build/
    Carousel.js - A single file combining all JS/CSS.
    Carousel.min.js - Smaller version minified using the YUI Compressor (8.1kb gzipped).
demo/
    index.html - Demo page showing an example carousel.


# Usage

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


# Notes:

1. A wrapper <div> is required with class "Carousel", and data- attributes
specifying the width/height (in pixels) and target href to open on click.

We recommend also setting style="display: none" to avoid showing content
before the carousel is activated.

2. Carousel items should be included as <li> list items in an <ul> tag.

3. Include the "Carousel.js" script immediately after the wrapper div.

4. An optional "Overlay" span can be included to show an overlay caption,
which will fade away when a user first interacts with the carousel.


# Build

Built versions of Carousel.js are included in /build.
However, a Makefile is included if you'd like to modify and build your own
(on any system that supports the Unix `make` utility).
