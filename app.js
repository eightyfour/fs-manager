/*global console */
/*jslint node: true */
var express = require('express'),
    fs = require('fs'),
    shoe = require('shoe'),
    dnode = require('dnode'),
    bash = require('./lib/server/bash.js');
var app = express();


app.use(express.static(__dirname + '/fe'));

app.get('/*', function (request, response, next) {
    "use strict";

    var res = response;

    fs.readFile(__dirname + '/fe/index.html', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });

});

var server = app.listen(3000);

var con;
var sock = shoe(function (stream) {
    "use strict";
    var d = dnode({
        init : function (msg) {
            console.log('HALLO: ' + msg);
        },
        bash : bash
    });
    d.pipe(stream).pipe(d);
    con = stream;

    con.on('end', function () {
        console.log('end');
    });
});
var inst = sock.install(server, '/trade');

console.log("start server 3000");