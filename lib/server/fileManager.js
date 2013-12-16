var fs = require('fs');
var encoding = 'utf8';

var fileManager = (function () {
    "use strict";

    var code = "function foo(items) {" +
        "var i;\n" +
        "    for (i = 0; i &lt; items.length; i++) {\n" +
        "        alert('Ace Rocks ' + items[i]);\n" +
        "    }\n" +
        "}",

        getFileSource = function(file, callBack) {

            fs.exists(file, function(exists) {

                if (exists) {
                    fs.readFile(file, encoding, function (err, data) {
                        if (err) throw err;
                        callBack(data);
                    });
                } else {
                    // create file
                    // fs.openSync(file, 'w');
                }
            });
        };

    return {
        getFile : function (obj, cb) {
            getFileSource('/home/han/dev/nodejs/git/fs-manager/' + obj, cb);
//            cb(obj, code);
        },
        saveFile : function (obj, cb) {

            cb(obj, true);
        }
    };

}());

module.exports = fileManager;