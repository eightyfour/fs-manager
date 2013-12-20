/*global ace */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js'),
    C = require('../../CONST.js');

window.domOpts = window.domOpts || require('dom-opts');

var imageViewer = function (modules) {
    "use strict";

    var findTag = function (root, tag) {
            var tags = [];
            [].slice.call(root.children).forEach(function (e) {
                if (e.tagName.toLowerCase() === tag.toLowerCase()) {
                    tags.push(e);
                }
            });
            return tags;
        };


    modules.imageViewer = function (nodeToAppend) {
        nodeToAppend.setAttribute('id', 'fileEditor');
        var fc = {
            showImage : function (obj) {
                var img, editor, pres = findTag(nodeToAppend, 'img'),
                // TODO doesn't work if two files has same name
                    actualImg = document.getElementById(obj.name);

                if (pres.length > 0) {
                    // there are other open images
                    pres.forEach(function (e) {
                        e.domAddClass('hidden');
                    });
                }
                img = new Image();
                img.onload = function () {
                    console.log('DONE IMAGE');
                };
                img.src =  "data:image/png;base64," + obj.data;
                img.domAppendTo(nodeToAppend);
//                img.width = "100";
//                img.height = "100";

            }
        };

        events.addServerListener('sendFile', function (obj) {
            if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.IMAGE) {
                fc.showImage(obj);
            } else {
                console.log('imageViewer: IS NOT A IMAGE - DO NOTHING');
            }
        });

    };
};

module.exports = imageViewer;
