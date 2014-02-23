#!/bin/sh
browserify lib/client/main.js -o fe/js/min/fe.js
node app.js

