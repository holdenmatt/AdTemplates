/*!
 * Carousel.js utility functions.
 */
window.TouchCarousel = window.TouchCarousel || {};
window.TouchCarousel.util = (function () {

    var util = {};

    // Set style properties on an element.
    util.setStyles = function (el, styles) {
        for (var prop in styles) {
            if (styles.hasOwnProperty(prop)) {
                el.style[prop] = styles[prop];
            }
        }
    };

    // Create a DOM element with given tagName, attributes, and style properties.
    util.createElement = function (tagName, attrs, styles) {
        var el = document.createElement(tagName);
        for (var attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                el.setAttribute(attr, attrs[attr]);
            }
        }
        util.setStyles(el, styles);
        return el;
    };

    // Add CSS text to the document head as a style tag.
    // http://stackoverflow.com/questions/524696/how-to-create-a-style-tag-with-javascript
    util.addStyles = function (styles) {

        var style = util.createElement('style', {
            type: 'text/css'
        });

        var rules = document.createTextNode(styles);
        if (style.styleSheet) {
            style.styleSheet.cssText = rules.nodeValue;
        } else {
            style.appendChild(rules);
        }

        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    };

    // Add/remove CSS classes from an element.
    util.hasClass = function (el, className) {
        var re = new RegExp('(\\s|^)' + className + '(\\s|$)');
        return el.className.match(re);
    };
    util.addClass = function (el, className) {
        if (!util.hasClass(el, className)) {
            el.className += ' ' + className;
        }
    };
    util.removeClass = function (el, className) {
        var re = new RegExp('(\\s|^)' + className + '(\\s|$)');
        el.className = el.className.replace(re, ' ');
    };

    return util;
})();
