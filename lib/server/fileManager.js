/*global projectFolder */
var fs = require('fs');
var encoding = 'utf8';

var fileManager = (function () {
    "use strict";

    var getFileSource = function (file, callBack) {

            fs.exists(file, function (exists) {
                if (exists) {
                    fs.readFile(file, encoding, function (err, data) {
                        if (err) {throw err; }
                        callBack(data);
                    });
                }
            });
        };

    return {
        getFile : function (obj, cb) {
            getFileSource(projectFolder + '/' + obj, cb);
//            cb(obj, code);
        },
        saveFile : function (obj, cb) {

            cb(obj, true);
        }
    };

}());

module.exports = fileManager;