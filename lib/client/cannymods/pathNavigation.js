/*jslint browser: true */
var trade = require('../trade.js');

var pathNavigation = function (modules) {
    "use strict";

    modules.pathNavigation = function (nodeToAppend) {
        console.log('START GENERATE MENU');
        var ul = window.domOpts.createElement('ul', 'pathNavigation'),
            li,
            a,
            currentPath = document.location.pathname;
        // remove trailing '/'
        if (currentPath && currentPath[0] === '/') {
            currentPath = currentPath.slice(1);
        }

        trade.listPath(currentPath, function (obj) {
            if (!obj.fail) {
                obj.value.forEach(function (elm) {
                    li = window.domOpts.createElement('li');
                    li.style.color = elm.d ? '#330000' : '#000033';
                    a = window.domOpts.createElement('a');
                    a.addEventListener('click', function (e) {
                        alert(this.innerText);
                    });
                    a.innerText = elm.name;
                    a.domAppendTo(li);
                    li.domAppendTo(ul);
                });
            } else {
                console.log('SOMETHING WRONG ON SERVER SIDE - CANT GET LISTPATH');
            }

        });

        ul.domAppendTo(nodeToAppend);

    };
};

module.exports = pathNavigation;
