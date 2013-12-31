/*global */
/*jslint browser: true */

window.domOpts = window.domOpts || require('dom-opts');

var tabManager = (function () {
    "use strict";

    var nodeToAppend,
        config = {
            idPrefix : 'tabManager_'
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
        tabSessions = (function () {
            var id = 0,
                session = {};

            return {
                getNewId : function (nodeId) {
                    var gId = config.idPrefix + id;
                    id++;
                    session[gId] = nodeId;
                    return gId;
                },
                session : session
            };
        }()),
        fc = {
            addTabNode : function (name, id) {
                var tab = window.domOpts.createElement('div', id, 'tab'),
                    active = window.domOpts.createElement('div', null, 'activeButton'),
                    close = window.domOpts.createElement('div', null, 'closeButton');
                active.innerText = name;
                active.setAttribute('title', name);
                active.domAppendTo(tab);
                close.domAppendTo(tab);
                tab.domAppendTo(nodeToAppend);
                return {
                    root : tab,
                    active : active,
                    close : close
                };
            },
            removeTabNode : function (node) {
                node.domRemove();
            },
            registerClickEvent : function (node, id, cb) {
                node.addEventListener('click', function () {
                    cb(tabSessions.session[id]);
                });
            },
            activeTab  : function (id) {
                var node = document.getElementById(id),
                    tabs = findTag(nodeToAppend, 'div');
                tabs.forEach(function (e) {
                    e.domRemoveClass('active');
                });
                node.domAddClass('active');
            }
        };

    return {
        canny : {
            id : 'tabManager',
            initDom : function (domRoot) {
                nodeToAppend = domRoot;
                nodeToAppend.setAttribute('id', 'tabManager');
            }
        },
        addTab : function (obj) {
            var tabSessionId = tabSessions.getNewId(obj.id),
                tab = fc.addTabNode(obj.text, tabSessionId);
            fc.registerClickEvent(tab.active, tabSessionId, obj.onclick);
            fc.registerClickEvent(tab.close, tabSessionId, obj.onclose);
            fc.activeTab(tabSessionId);
            return tabSessionId;
        },
        removeTab : function (tabSessionId) {
            document.getElementById(tabSessionId).domRemove();
        },
        activeTab : function (tabSessionId) {
            fc.activeTab(tabSessionId);
        }
    };
}());

module.exports = tabManager;