/*global projectFolder */
var fs = require('fs'),
    C = require('../CONST.js');

var fileManager = (function () {
    "use strict";
    /*
     * file type could be
     * TODO add all possible extensions
     */
    var getFileType = function (file) {
            var extension = file.slice(file.lastIndexOf('.') + 1);
            return extension === 'png' ? C.FILE_MANAGER.FILE_TYPES.IMAGE : C.FILE_MANAGER.FILE_TYPES.FILE;
        },
        getFileSource = function (file, callBack) {
            var fileType = getFileType(file);
            fs.exists(file, function (exists) {
                if (exists) {
                    fs.readFile(file, C.FILE_MANAGER.ENCODING[fileType], function (err, data) {
                        if (err) {throw err; }
                        callBack({data: data, filePath : file, fileType: getFileType(file)});
                    });
                }
            });
        },
        setFileSource = function (file, data, callBack) {
            fs.exists(file, function (exists) {
                if (exists) {
                    fs.writeFile(file, data, encoding, function (err) {
                        if (err) {return console.log(err); }
                        callBack(true);
                    });
                }
            });
        };

    return {
        getFile : function (obj, cb) {
            var filePath = projectFolder + '/' + obj;
            getFileSource(filePath, cb);
//            cb(obj, code);
        },
        saveFile : function (obj, cb) {
            setFileSource(projectFolder + '/' + obj.path, obj.data, cb);
        }
    };

}());

module.exports = fileManager;