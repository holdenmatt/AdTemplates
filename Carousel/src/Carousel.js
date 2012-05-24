/*!
 * Carousel.js
 *
 * A touch-enabled image carousel.
 */
window.TouchCarousel = window.TouchCarousel || {};
(function () {

    var carousel;

    // Open the carousel's target URL after a tap event on the item with
    // given index.  Redirect by default, but you can override this if needed.
    window.TouchCarousel.open = function (url, itemIndex) {
        window.open(url, '_blank');
    };

    // Called for every user 'swipe' event.
    window.TouchCarousel.onSwipe = function () {
        // Do nothing.  Add in-ad tracking call here if needed.
    };

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
        util.addStyleTag(window.TouchCarousel.styles);

        carousel.initialize();
    }, false);

    var util = window.TouchCarousel.util;

    // Return an attribute value with given name, or throw an error.
    function getAttribute(el, name) {
        var value = el.getAttribute(name);
        if (!value) {
            throw new Error('Missing required attribute: ' + name);
        }
        return value;
    }

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

        // Wrap the ul items in a scroller div for iScroll.
        // iScroll will snap to quadrants by dividing this scroller width
        // with the wrapper width.
        this.scroller = util.createElement('div', {
            'class': 'scroller'
        }, {
            width: (this.width * this.items.length) + 'px',
            height: '100%'
        });
        this.el.appendChild(this.scroller);
        this.scroller.appendChild(this.ul);

        // Set dimensions on the wrapper and list items.
        util.addClass(this.el, 'wrapper');
        util.setStyles(this.el, {
            width: this.width + 'px',
            height: this.height + 'px'
        });
        for (var i = 0; i < this.items.length; i++) {
            util.setStyles(this.items[i], {
                width: this.width + 'px',
                height: this.height + 'px'
            });
        }

        this.initializeOverlay();

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

    Carousel.prototype.initializeOverlay = function () {
        this.overlay = this.el.querySelector('span.Overlay');
        if (this.overlay) {
            // Add the overlay to the scroller, so it doesn't block scrolling.
            var container = util.createElement('div', {
                'class': 'OverlayContainer'
            }, {
                width: this.width + 'px'
            });
            this.scroller.appendChild(container);
            container.appendChild(this.overlay);
        }
    };

    // Fade out when scrolling starts.
    Carousel.prototype.onScrollStart = function (e) {
        if (this.overlay) {
            util.fadeOut(this.overlay.parentNode);
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
            window.TouchCarousel.onSwipe();
        } else {
            var index = this.iScroll.currPageX;
            window.TouchCarousel.open(this.href, index);
        }
    };


    //--- PageIndicator ---//


    // Create a styled page indicator for a carousel.
    function PageIndicator (carousel) {
        this.carousel = carousel;

        var el = this.el = util.createElement('ul', {
            'class': 'PageIndicator'
        });
        carousel.iScroll.pagesX.forEach(function (page) {
            el.appendChild(util.createElement('li'));
        });

        // Update now and whenever a scroll finishes.
        this.update();
        this.carousel.iScroll.options.onScrollEnd = this.update.bind(this);
    }

    PageIndicator.prototype.update = function () {
        // Reset the current active indicator.
        var active = this.el.querySelector('li.active');
        util.removeClass(active, 'active');

        // Make the new one active for the current index.
        var index = this.carousel.iScroll.currPageX + 1,
            selector = 'li:nth-child(' + index + ')',
            target = this.el.querySelector(selector);
        util.addClass(target, 'active');
    };
})();
