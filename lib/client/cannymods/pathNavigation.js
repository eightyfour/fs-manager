/*jslint browser: true */
var trade = require('../trade.js'),
    events = require('../events.js');

var pathNavigation = function (modules) {
    "use strict";
    var ul = window.domOpts.createElement('ul', 'pathNavigation'),
        li,
        a,
        currentPath = document.location.pathname,
        select = {
            attr : {
                pathName : 'pathName'
            },
            css : {
                id : 'pathNavigation',
                openDir : 'openDir',
                openFile: 'openFile',
                loading : 'loading',
                showLoading: 'showLoading'
            }
        },
        fc = {
            getFullPath : function (node) {
                var pathName = [], parentNode = node.parentNode, attr, i, trim = '';

                (function parentNode(node) {
                    if ((attr = node.getAttribute(select.attr.pathName)) !== null) {
                        pathName.push(attr);
                        parentNode(node.parentNode);
                    } else {
                        if (currentPath !== '') {
                            pathName.push(currentPath);
                        }
                    }
                }(node));
                for (i = pathName.length - 1; i > 0; i--) {
                    trim += pathName[i] + '/';
                }
                trim += pathName[0];
                return trim;
            }
        };

    modules.pathNavigation = function (nodeToAppend) {
        console.log('START GENERATE MENU');
        var ui = {

            },
            events = {
                directoryClick : function (node) {
                    node.addEventListener('click', function (e) {
                        var parentNode = this.parentNode;

                        if (parentNode.domHasClass(select.css.openDir)) {
                            parentNode.domRemoveClass(select.css.openDir);
                        } else {

                            if (parentNode.children.length <= 1) {
                                parentNode.domAddClass(select.css.openDir + ' ' + select.css.showLoading + ' ' + select.css.loading);
                                trade.listPath(fc.getFullPath(parentNode), function (obj) {
                                    renderPathList(parentNode, obj, function () {
                                        parentNode.domRemoveClass(select.css.loading);
                                    });
                                });
                            } else {
                                parentNode.domAddClass(select.css.openDir);
                                console.log('FOLDER ALREADY LOADED');
                            }
                        }
                    });
                },
                fileClick : function (node) {
                    node.addEventListener('click', function (e) {
                        var parentNode = this.parentNode;

//                        if (parentNode.domHasClass(select.css.openFile)) {
//                            parentNode.domRemoveClass(select.css.openFile);
//                        } else {
                            parentNode.domAddClass(select.css.openFile);
                            trade.getFile(fc.getFullPath(parentNode));
//                        }
                    });
                }
            },
            renderPathList = function (parentNode, obj, doneCb) {
                if (!obj.fail) {
                    obj.value.forEach(function (elm) {
                        li = window.domOpts.createElement('li');
                        a = window.domOpts.createElement('a');
                        a.innerText = elm.name;
                        // is directory?
                        if (elm.d) {
                            li.style.color = '#f00';
                            events.directoryClick(a);
                        } else {
                            li.style.color = '#0aa';
                            events.fileClick(a);
                        }
                        a.domAppendTo(li);
                        li.setAttribute(select.attr.pathName, elm.name);
                        li.domAppendTo(parentNode);
                    });
                } else {
                    console.log('SOMETHING WRONG ON SERVER SIDE - CANT GET LISTPATH');
                }
                doneCb();
            };

        ul = window.domOpts.createElement('ul', select.css.id, select.css.openDir);
        ul.domAppendTo(nodeToAppend);

        // remove trailing '/'
        if (currentPath && currentPath[0] === '/') {
            currentPath = currentPath.slice(1);
        }

//        events.addServerListener('sendPathList', function (obj) {
//            renderPathList(obj);
//        });
        ul.domAddClass(select.css.loading + ' ' + select.css.showLoading);
        trade.listPath(currentPath, function (obj) {
            renderPathList(ul, obj, function () {
                ul.domRemoveClass(select.css.loading);
            });
        });
    };
};

module.exports = pathNavigation;