/*!
 * Carousel.js
 */
window.Carousel = (function () {

    //--- exports ---//

    var exports = {};

    // Open the carousel's target URL after a tap event on the item with
    // given index.  Redirect by default, but you can override this if needed.
    exports.open = function (url, itemIndex) {
        window.open(url, '_blank');
    };

    // Called for every user 'swipe' event.
    exports.onSwipe = function () {
        // Do nothing.  Add in-ad tracking call here if needed.
    };


    //--- Utility functions ---//


    // Polyfill Function.prototype.bind.  Adapted from:
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (context) {
            var slice = Array.prototype.slice,
                args = slice.call(arguments, 1),
                self = this,
                noop = function () {},
                bound = function () {
                    return self.apply(
                        this instanceof noop ? this : (context || {}),
                        args.concat(slice.call(arguments))
                    );
                };
            noop.prototype = this.prototype;
            bound.prototype = new noop();
            return bound;
        };
    }

    // Set style properties on an element.
    function setStyles (el, styles) {
        for (var prop in styles) {
            if (styles.hasOwnProperty(prop)) {
                el.style[prop] = styles[prop];
            }
        }
    }

    // Create a DOM element with given tagName, attributes, and style properties.
    function createElement (tagName, attrs, styles) {
        var el = document.createElement(tagName);
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                el.setAttribute(attr, attrs[attr]);
            }
        }
        setStyles(el, styles);
        return el;
    }

    // Add CSS text to the document head as a style tag.
    // http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
    function addStyleTag (styles) {

        var style = createElement('style', { type: 'text/css'}),
            head = document.getElementsByTagName('head')[0];

        var rules = document.createTextNode(styles);
        if (style.styleSheet) {
            style.styleSheet.cssText = rules.nodeValue;
        } else {
            style.appendChild(rules);
        }
        head.appendChild(style);
    }

    // Add/remove CSS classes from an element.
    function hasClass (el, className) {
        var re = new RegExp('(\\s|^)' + className + '(\\s|$)');
        return el.className.match(re);
    }
    function addClass (el, className) {
        if (el && !hasClass(el, className)) {
            el.className += ' ' + className;
        }
    }
    function removeClass (el, className) {
        if (el) {
            var re = new RegExp('(\\s|^)' + className + '(\\s|$)');
            el.className = el.className.replace(re, ' ');
        }
    }

    function fadeOut (el) {
        el.style.display = 'none';
    }

    // Return an attribute value with given name, or throw an error.
    function getAttribute(el, name) {
        var value = el.getAttribute(name);
        if (!value) {
            throw new Error('Missing required attribute: ' + name);
        }
        return value;
    }

    // Validate and return an integer attribute value.
    function getIntegerAttribute(el, name) {
        var value = getAttribute(el, name),
            intValue = parseInt(value, 10);
        if (String(intValue) !== value) {
            throw new Error('Attribute must be an integer: ' + name);
        }
        return intValue;
    }


    //--- Carousel ---//


    // Create a carousel from a wrapper div element containing a ul of items.
    // Get/validate required data- attributes.
    function Carousel (el) {
        this.el = el;

        // Get width, height, href from data- attributes on the wrapper div.
        this.href = getAttribute(el, 'data-href');
        this.width = getIntegerAttribute(el, 'data-width');
        this.height = getIntegerAttribute(el, 'data-height');

        // The carousel div must contain a ul with li items.
        this.ul = el.querySelector('ul');
        if (!this.ul) {
            throw new Error('Carousel div must contain an <ul> tag');
        }
        this.items = this.ul.querySelectorAll('li');
        if (this.items.length === 0) {
            throw new Error('Carousel ul must contain <li> items');
        }
    }

    // Show the carousel and activate scrolling.
    Carousel.prototype.initialize = function () {

        // Set dimensions on the wrapper and list items.
        addClass(this.el, 'wrapper');
        setStyles(this.el, {
            width: this.width + 'px',
            height: this.height + 'px'
        });
        for (var i = 0; i < this.items.length; i++) {
            setStyles(this.items[i], {
                width: this.width + 'px',
                height: this.height + 'px'
            });
        }

        // Wrap the ul items in a scroller div for iScroll.
        // iScroll will snap to quadrants by dividing this scroller width
        // with the wrapper width.
        this.scroller = createElement('div', {
            'class': 'scroller'
        }, {
            width: (this.width * this.items.length) + 'px',
            height: '100%'
        });
        this.el.appendChild(this.scroller);
        this.scroller.appendChild(this.ul);

        // Initialize the optional overlay.
        this.overlay = this.el.querySelector('span.Overlay');
        if (this.overlay) {
            // Add the overlay to the scroller, so it doesn't block scrolling.
            var container = createElement('div', {
                'class': 'OverlayContainer'
            }, {
                width: this.width + 'px'
            });
            this.scroller.appendChild(container);
            container.appendChild(this.overlay);
        }

        // Show the element now, so iScroll can use its dimensions.
        this.el.style.display = 'block';

        // Create the iScroll carousel.
        var options = {
            snap: true,
            momentum: false,
            hScrollbar: false,
            wheelAction: 'none',
            onScrollStart: this.onScrollStart.bind(this),
            onScrollMove: this.onScrollMove.bind(this),
            onTouchEnd: this.onTouchEnd.bind(this)
        };
        this.iScroll = new iScroll(this.el, options);

        // Add a page indicator.
        this.indicator = new PageIndicator(this);
        this.el.appendChild(this.indicator.el);
    };

    // Fade out when scrolling starts.
    Carousel.prototype.onScrollStart = function (e) {
        if (this.overlay) {
            fadeOut(this.overlay.parentNode);
        }
    };

    // Remember if we ever scroll outside the threshold.
    Carousel.prototype.onScrollMove = function (e) {
        if (!this.scrolledOut) {
            var threshold = this.iScroll.options.snapThreshold,
                scrolledOutX = this.iScroll.absDistX > threshold,
                scrolledOutY = this.iScroll.absDistY > threshold;
            if (scrolledOutX || scrolledOutY) {
                this.scrolledOut = true;
            }
        }
    };

    // If a scroll moves < snapThreshold, consider it a tap.
    Carousel.prototype.onTouchEnd = function (e) {

        // If onTouchEnd was triggered by mouseout, ignore tap.
        if (e.type === 'mouseout') {
            return;
        }

        if (this.scrolledOut) {
            // Prevent clicks if we've already scrolled out.
            var preventClick = function () {
                e.stopPropagation();
                e.target.removeEventListener('click', preventClick, false);
            };
            e.target.addEventListener('click', preventClick, false);
            this.scrolledOut = false;
            exports.onSwipe();
        } else {
            var index = this.iScroll.currPageX;
            exports.open(this.href, index);
        }
    };


    //--- PageIndicator ---//


    // Create a styled page indicator for a carousel.
    function PageIndicator (carousel) {
        this.carousel = carousel;

        var el = this.el = createElement('ul', {
            'class': 'PageIndicator'
        });
        carousel.iScroll.pagesX.forEach(function (page) {
            el.appendChild(createElement('li'));
        });

        // Update now and whenever a scroll finishes.
        this.update();
        this.carousel.iScroll.options.onScrollEnd = this.update.bind(this);
    }

    PageIndicator.prototype.update = function () {
        // Reset the current active indicator.
        var active = this.el.querySelector('li.active');
        removeClass(active, 'active');

        // Make the new one active for the current index.
        var index = this.carousel.iScroll.currPageX + 1,
            selector = 'li:nth-child(' + index + ')',
            target = this.el.querySelector(selector);
        addClass(target, 'active');
    };


    //--- Initialize ---//


    var carousel;

    // Activate (only) the *last* div.Carousel element found.
    // If this script is included immediately after a Carousel's markup,
    // we'll only activate the preceding Carousel as expected.
    var carousels = document.querySelectorAll('div.Carousel');
    if (carousels.length > 0) {
        carousel = new Carousel(carousels[carousels.length - 1]);
    } else {
        throw new Error('div.Carousel not found');
    }

    // Add styles and activate/show the carousel after the document loads.
    document.addEventListener('DOMContentLoaded', function () {
        // The Makefile inlines compressed CSS styles as a string variable.
        // Add them to the document head as a style tag.
        addStyleTag(window.Carousel.styles);

        carousel.initialize();
    }, false);

    return exports;
})();
