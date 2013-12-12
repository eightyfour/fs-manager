/*jslint browser: true */
/**
 * handle the connection between server and client
 */
var domready = require('domready'),
    C = require('../CONST.js'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    stream = shoe('/trade'),
    d = dnode();

window.domOpts = window.domOpts || require('dom-opts');

console.log('CREATE TRADE INSTANCE');

var trade = (function () {
    "use strict";
    // ready queue call registered call backs when trade is ready
    var cbs = [],
        server;

    return {
        // Not really tested
        ready : function (cb) {
            if (server) {
                cb();
            } else {
                cbs.push(cb);
            }
        },
        init : function (s) {

            server = s;
            server.init('der client');
            // call ready queue
            cbs.map(function (cb) {
                cb && cb();
                return null;
            });
        },
        listPath : function (path, cb) {
            server.bash.exec({
                comand : C.BASH.LS,
                path : path
            }, cb);
        },
        getFile : function (cb) {

        }
    };
}());

domready(function () {
    "use strict";
    d.on('remote', function (server) {
        trade.init(server);
    });
    d.pipe(stream).pipe(d);
});

module.exports = trade;