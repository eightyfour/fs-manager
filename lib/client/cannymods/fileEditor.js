/*global ace */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js'),
    C = require('../../CONST.js');

window.domOpts = window.domOpts || require('dom-opts');

var fileEditor = function (modules) {
    "use strict";

    var config = {
            idPrefix : 'fileEditor_'
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
        aceFileExtensionMap = {
            js : 'javascript'
        },
        getExtension = function (filePath) {
            return filePath.slice(filePath.lastIndexOf('.') + 1);
        };

    var editorSaver = (function () {
        var editors = {};
        return {
            editors : editors
        };
    }());

    modules.fileEditor = function (nodeToAppend) {
        nodeToAppend.setAttribute('id', 'fileEditor');
        var fc = {
            hideEditors : function () {
                var pres = findTag(nodeToAppend, 'pre');
                if (pres.length > 0) {
                    // there are other open editors
                    pres.forEach(function (e) {
                        e.domAddClass('hidden');
                    });
                }
            },
            showInEditor : function (obj) {
                var id = config.idPrefix + obj.id,
                    pre,
                    editor,
                    actualPre = document.getElementById(id);

                if (actualPre !== null) {
                    actualPre.domRemoveClass('hidden');
                } else {
                    pre = window.domOpts.createElement('pre', id, 'aceEditor');
                    pre.innerHTML = obj.data;
                    pre.domAppendTo(nodeToAppend);
                    editor = ace.edit(id);
                    editor.setTheme("ace/theme/twilight");
                    editor.getSession().setMode("ace/mode/javascript");
                }
            }
        };

        events.addServerListener('sendFile', function (obj) {
            console.log('OPEN FILE IN EDITOR');
            fc.hideEditors();
            if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.FILE) {
                fc.showInEditor(obj);
            }
        });

    };
};

module.exports = fileEditor;
