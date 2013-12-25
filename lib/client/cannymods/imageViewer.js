/*global ace */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js'),
    C = require('../../CONST.js');

window.domOpts = window.domOpts || require('dom-opts');

var imageViewer = function (modules) {
    "use strict";

    var config = {
            idPrefix : 'imageViewer_'
        },
        findTag = function (root, tag) {
            var tags = [];
            [].slice.call(root.children).forEach(function (e) {
                if (e.tagName.toLowerCase() === tag.toLowerCase()) {
                    tags.push(e);
                }
            });
            return tags;
        },
        setupContainerCSS = function (node, css) {
            for (var prop in css) {
                node.style[prop] =  css[prop];
            }
        };


    modules.imageViewer = function (nodeToAppend) {

        var settings = {
                maxWidth : 300,
                maxHeight: 300
            },
            fc = {
                hideImageViewer : function () {
                    var pres = findTag(nodeToAppend, 'img');

                    if (pres.length > 0) {
                        // there are other open images
                        pres.forEach(function (e) {
                            e.domAddClass('hidden');
                        });
                    }
                },
                showImage : function (obj) {
                    var img, id = config.idPrefix + obj.id,
                        actualImg = document.getElementById(id);

                    if (actualImg !== null) {
                        actualImg.domRemoveClass('hidden');
                    } else {
                        img = new Image();
                        img.onload = function () {
                            console.log('DONE IMAGE');
                        };
                        img.src =  "data:image/png;base64," + obj.data;
                        setupContainerCSS(img, {
                            maxWidth : '100%',
                            maxHeight : '100%'
                        });
                        img.setAttribute('id', id);
                        img.domAppendTo(nodeToAppend);
                    }
                }
            };

        nodeToAppend.setAttribute('id', 'imageViewer');

        setupContainerCSS(nodeToAppend, {
            width : settings.maxWidth + 'px',
            height: settings.maxHeight + 'px'
        });

        events.addServerListener('sendFile', function (obj) {

            fc.hideImageViewer();

            if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.IMAGE) {
                fc.showImage(obj);
            }
        });

        return {
            setup : function (config) {
                var obj;
                for (obj in config) {
                    settings[obj] = config[obj];
                }
            }
        };
    };
};

module.exports = imageViewer;