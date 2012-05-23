/*!
 * Carousel.js
 *
 * A touch-enabled image carousel.
 */
window.TouchCarousel = window.TouchCarousel || {};
(function () {

    // Open the carousel's target URL after a tap event on the item with
    // given index.  Redirect by default, but you can override this if needed.
    window.TouchCarousel.open = function (url, itemIndex) {
        window.open(url, '_blank');
    };

    // Called for every user 'swipe' event.
    window.TouchCarousel.onSwipe = function () {
        // Do nothing.  Add in-ad tracking call here if needed.
    };

    var util = window.TouchCarousel.util;

    // Find the last div.Carousel element to activate.
    var wrapper = document.querySelectorAll('div.Carousel');
    if (wrapper.length > 0) {
        // Only activate the last one.
        wrapper = wrapper[wrapper.length - 1];
    } else {
        console.log('Cannot activate Carousel: no ul.Carousel element found');
    }

    // iScroll options.
    var options = {
        snap: true,
        momentum: false,
        hScrollbar: false,
        wheelAction: 'none',

        // If the carousel moves more than this amount, we snap to the
        // next item.  Less than this, and we trigger a tap.
        snapThreshold: 5
    };


    // Create a carousel from a wrapper div containing an ul of items.
    function Carousel (wrapper, options) {

        this.el = this.wrapper = wrapper;
        this.options = options;

        // width/height must be set on the carousel div.
        this.width = parseInt(wrapper.style.width, 10);
        this.height = parseInt(wrapper.style.height, 10);
        if (!this.width || !this.height) {
            throw new Error('div.Carousel must have a width/height');
        }

        this.href = wrapper.getAttribute('data-href');
        if (!this.href) {
            throw new Error('div.Carousel must have a data-href attribute');
        }

        // The carousel div must contain a ul with li items.
        var ul = wrapper.querySelector('ul');
        if (!ul) {
            throw new Error('div.Carousel must contain an <ul> tag');
        }
        var items = ul.querySelectorAll('li');
        if (items.length === 0) {
            throw new Error('div.Carousel > ul must contain <li> items');
        }

        // iScroll will snap to quadrants by dividing the scroller
        // size by the wrapper size, so scale the scroller width.
        this.scroller = util.createElement('div', {}, {
            width: this.width * items.length + 'px',
            height: '100%'
        });

        util.addClass(this.wrapper, 'wrapper');
        util.addClass(this.scroller, 'scroller');

        for (var i = 0; i < items.length; i++) {
            util.setStyles(items[i], {
                width: this.width + 'px',
                height: this.height + 'px'
            });
        }

        this.scroller.appendChild(ul);
        this.wrapper.appendChild(this.scroller);

        this.wrapper.style.display = 'block';

        this.initializeOverlay();

        options.onScrollStart = this.onScrollStart.bind(this);
        options.onScrollMove = this.onScrollMove.bind(this);
        options.onTouchEnd = this.onTouchEnd.bind(this);

        this.iScroll = new iScroll(this.wrapper, options);

        this.indicator = new PageIndicator(this);
        this.wrapper.appendChild(this.indicator.el);
    }

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
            var threshold = this.options.snapThreshold,
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

    // Create a styled page indicator for a given carousel.
    function PageIndicator (carousel) {
        this.carousel = carousel;

        var el = this.el = util.createElement('ul', {
            'class': 'PageIndicator dark'
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

    function onload () {
        // The Makefile inlines compressed CSS styles as a string variable.
        // Add them to the document head as a style tag.
        util.addStyles(window.TouchCarousel.styles);

        new Carousel(wrapper, options);
    }
    document.addEventListener('DOMContentLoaded', onload, false);
})();
