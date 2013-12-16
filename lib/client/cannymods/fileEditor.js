/*global ace */
/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js');

window.domOpts = window.domOpts || require('dom-opts');

var fileEditor = function (modules) {
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

    modules.fileEditor = function (nodeToAppend) {
        nodeToAppend.setAttribute('id', 'fileEditor');
        var fc = {
            showInEditor : function (obj) {
                var pre, editor, pres = findTag(nodeToAppend, 'pre');


                var actualPre = document.getElementById(obj.name);

                if (pres.length > 0) {
                    // there are other open editors
                    pres.forEach(function (e) {
                        e.domAddClass('hidden');
                    });
                }

                if (actualPre !== null) {
                    actualPre.domRemoveClass('hidden');
                } else {
                    pre = window.domOpts.createElement('pre', obj.name, 'aceEditor');
                    pre.innerHTML = obj.file;
                    pre.domAppendTo(nodeToAppend);
                    editor = ace.edit(obj.name);
                    editor.setTheme("ace/theme/twilight");
                    editor.getSession().setMode("ace/mode/javascript");
                }


            }
        };

        events.addServerListener('sendFile', function (obj) {
            console.log('OPEN FILE IN EDITOR');
            fc.showInEditor(obj);
        });

    };
};

module.exports = fileEditor;
