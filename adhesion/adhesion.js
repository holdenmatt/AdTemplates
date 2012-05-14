/*
 * adhesion.js
 * This script makes a banner div (indiciated by a class name) and docks it
 * to either the top or bottom of a mobile device screen. See adhesion.html for
 * the basic HTML and CSS that should be included with this script.
 */

(function (window) {

    // Modify to match the class name of your header/footer div
    var config = {
        'headerClass': 'adHeader',
        'footerClass': 'adFooter'
    };

    // Apply a style object to a DOM element
    function setStyles(element, styles) {
        for (var key in styles) {
            element.style[key] = styles[key];
        }
    }

    // Determine if an element has a class
    function hasClass(element, cls) {
        var r = new RegExp('\\b' + cls + '\\b');
        return r.test(element.className);
    }

    // Check for Android and iOS support of position: fixed
    function fixedSupported() {
        var ua = window.navigator.userAgent;

        if (ua.match(/(iPhone|iPod|iPad)/)) {
            return ua.match(/[5-9]_[0-9]/) || false;
        }
        if (ua.match(/(Android)/)) {
            return ua.match(/[3-9]\.[0-9]\.[0-9]/) || ua.match(/2\.[2-3]\.[0-9]/) || false;
        }
        return true; // Assume fixed positioning works
    }

    function applyFixed(element) {
        var style = {
            'position': 'fixed'
        };

        if (hasClass(element, config.headerClass)) {
            style.top = '0';
        } else if (hasClass(element, config.footerClass)) {
            style.bottom = '0';
        }

        setStyles(element, style);
    }

    function reposition(element) {
        var pos = window.pageYOffset;

        if (hasClass(element, config.footerClass)) {
            pos += window.innerHeight - element.clientHeight;
        }

        setStyles(element, {
            'position': 'absolute',
            'top': 0,
            'webkitTransform':
                'translateY(' + pos + 'px)'
        });
    }

    function applyFallback(element) {
        reposition(element);

        setTimeout(function () {
            setStyles(element, {
                '-webkit-transition':
                    '-webkit-transform 150ms ease-out'
            });
        }, 0);

        window.addEventListener('scroll', function () {
            reposition(element);
        }, false);
    }

    function initialize() {
        var d = window.document,
            headers = d.getElementsByClassName(config.headerClass),
            footers = d.getElementsByClassName(config.footerClass),
            header = headers.length > 0 ? headers[0] : null,
            footer = footers.length > 0 ? footers[0] : null;

        if (fixedSupported()) {
            if (header) { applyFixed(header); }
            if (footer) { applyFixed(footer); }
        } else {
            if (header) { applyFallback(header); }
            if (footer) { applyFallback(footer); }
        }
    }

    window.addEventListener('load', initialize, false);
})(window);
