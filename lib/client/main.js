/*jslint browser: true */
var domready = require('domready'),
    trade = require('./trade.js'),
    canny = require('canny');

window.canny = canny;
window.domOpts = window.domOpts || require('dom-opts');


require('./cannymods/fileEditor.js');
require('./cannymods/tabManager.js');
require('./cannymods/imageViewer.js');
require('./cannymods/pathNavigation.js');

trade.ready(function () {
    "use strict";
    canny.pathNavigation.init();
});
