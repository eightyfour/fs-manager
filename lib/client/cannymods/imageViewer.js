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
        var settings = {
                maxWidth : 200,
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
                scaleImageSize : function (img, maxWidth, maxHeight) {
                    // TODO scale image correctly
                    var scaleX = 0,
                        scaleY = 0,
                        height = img.height,
                        width = img.width;
                    if (width > maxWidth) {
                        scaleX = ((width - maxWidth) * 100) / width;
                        width = maxWidth;
                    }

                    if (scaleX !== 0) {
                        height = (height * scaleX) / 100;
                    }

                    if (height > maxHeight) {
                        scaleY = ((height - maxHeight) * 100) / height;
                        height = maxHeight;
                    }

                    if (scaleY !== 0) {
                        width = (width * scaleY) / 100;
                    }

                    return {
                        w : width,
                        h : height
                    };
                },
                showImage : function (obj) {
                    var img,
                    // TODO     doesn't work if two files has same name
                        actualImg = document.getElementById(obj.name);

                    img = new Image();
                    img.onload = function () {
                        console.log('DONE IMAGE');
                    };
                    img.src =  "data:image/png;base64," + obj.data;
                    (function (img) {
                        var d = fc.scaleImageSize(img, settings.maxWidth, settings.maxHeight);
                        img.width = d.w;
                        img.height = d.h;
                    }(img));
                    img.domAppendTo(nodeToAppend);
                }
            };

        events.addServerListener('sendFile', function (obj) {

            fc.hideImageViewer();

            if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.IMAGE) {
                fc.showImage(obj);
            } else {
                console.log('imageViewer: IS NOT A IMAGE - DO NOTHING');
            }
        });

        return {
            // TODO make it callable from client via canny
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
