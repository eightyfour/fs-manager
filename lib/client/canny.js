/*jslint browser: true */
var domready = require('domready'),
    trade = require('./trade.js'),
    fileEditor = require('./cannymods/fileEditor.js'),
    pathNavigation = require('./cannymods/pathNavigation.js');
window.domOpts = window.domOpts || require('dom-opts');


var canny = (function () {
    "use strict";

    var modules = {};
    pathNavigation(modules);
    fileEditor(modules);

    return {
        init : function () {
            var cannyChildren = [].slice.call(document.querySelectorAll('[canny]'));
            cannyChildren.forEach(function (node) {
                var attribute = node.getAttribute('canny');
                if (modules.hasOwnProperty(attribute)) {
                    modules[attribute](node);
                }
            });
        }
    };
}());

trade.ready(function () {
    "use strict";
    canny.init();
});


module.exports = canny;
