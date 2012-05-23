/*!
 * Carousel.js
 *
 * A touch-enabled image carousel.
 */
window.TouchCarousel = window.TouchCarousel || {};
(function () {

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
        vScrollbar: false,
        wheelAction: 'none',

        // If the carousel moves more than this amount, we snap to the
        // next item.  Less than this, and we trigger a tap.
        snapThreshold: 5
    };


    // Create a carousel from a wrapper div containing an ul of items.
    function Carousel (wrapper, options) {

        this.wrapper = wrapper;
        this.options = options;

        var width = parseInt(wrapper.style.width, 10),
            height = parseInt(wrapper.style.height, 10);

        if (!width || !height) {
            throw new Error('div.Carousel must have a width/height');
        }

        var ul = wrapper.querySelector('ul');
        if (!ul) {
            throw new Error('div.Carousel must contain an <ul> tag');
        }
        var items = ul.querySelectorAll('li');
        if (items.length === 0) {
            throw new Error('div.Carousel > ul must contain <li> items');
        }

        util.addClass(this.wrapper, 'wrapper');

        this.scroller = util.createElement('div', {
            'class': 'scroller'
        }, {
            width: width * items.length + 'px',
            height: '100%'
        });

        for (var i = 0; i < items.length; i++) {
            util.setStyles(items[i], {
                width: width + 'px',
                height: height + 'px'
            });
        }

        this.scroller.appendChild(ul);
        this.wrapper.appendChild(this.scroller);

        this.wrapper.style.display = 'block';

        options.onScrollEnd = this.onScrollEnd;

        this.iScroll = new iScroll(this.wrapper, options);

        this.indicator = new PageIndicator(this);
        this.wrapper.appendChild(this.indicator.el);
    }

    Carousel.prototype.onScrollEnd = function () {
        document.querySelector('.PageIndicator > li.active').className = '';
        document.querySelector('.PageIndicator > li:nth-child(' + (this.currPageX + 1) + ')').className = 'active';
    };


    // Create a styled page indicator for a given carousel.
    function PageIndicator (carousel) {
        this.carousel = carousel;

        var el = this.el = util.createElement('ul', {
            'class': 'PageIndicator'
        });

        var dots = carousel.iScroll.pagesX.map(function (page) {
            return util.createElement('li');
        });
        dots[0].className = 'active';

        dots.forEach(function (dot) {
            el.appendChild(dot);
        });
    }

    function onload () {
        // The Makefile inlines compressed CSS styles as a string variable.
        // Add them to the document head as a style tag.
        util.addStyles(window.TouchCarousel.styles);

        // add overlay
        // bind scroll methods
        // add page indicator?

        var carousel = new Carousel(wrapper, options);
    }

    document.addEventListener('DOMContentLoaded', onload, false);
})();
