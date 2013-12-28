/*global */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js'),
    C = require('../../CONST.js'),
    ace = require("brace");

require('brace/mode/javascript');
require('brace/mode/text');
require('brace/mode/json');
require('brace/mode/css');
require('brace/mode/html');
require('brace/theme/twilight');

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
            // more editors could be found in node_modules: brace/mode
            getMode : function (extension) {
                if (this.hasOwnProperty(extension)) {
                    return this[extension];
                }
                return this.defaultMode;
            },
            js : 'ace/mode/javascript',
            json : 'ace/mode/json',
            css : 'ace/mode/css',
            html : 'ace/mode/html',
            defaultMode : 'ace/mode/text'
        },
        getExtension = function (filePath) {
            return filePath.slice(filePath.lastIndexOf('.') + 1);
        },
        editorSaver = (function () {
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
                    actualPre = document.getElementById(id),
                    showInAceEditor = function () {
                        editor = ace.edit(id);

                        editor.getSession().setMode(
                            aceFileExtensionMap.getMode(
                                getExtension(obj.name)));
//                    editor.setTheme('ace/theme/monokai');
                        editor.setTheme("ace/theme/twilight");
                        editor.setReadOnly(true);
                    };

                if (actualPre !== null) {
                    actualPre.domRemoveClass('hidden');
                } else {
                    pre = window.domOpts.createElement('pre', id, 'aceEditor');
                    if (/!DOCTYPE html/.test(obj.data.slice(0, 20))) {
                        pre.innerHTML = obj.data.
                            replace(/&/g, '&amp;').
                            replace(/"/g, '&quot;').
                            replace(/'/g, '&#39;').
                            replace(/</g, '&lt;').
                            replace(/>/g, '&gt;');
                    } else {
                        pre.innerHTML = obj.data;
                    }
                    pre.domAppendTo(nodeToAppend);

                    showInAceEditor();

                }
            }
        };

        events.addServerListener('sendFile', function (obj) {
            fc.hideEditors();
            if (obj.fileType === C.FILE_MANAGER.FILE_TYPES.FILE) {
                fc.showInEditor(obj);
            }
        });

    };
};

module.exports = fileEditor;