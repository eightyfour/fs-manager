#!/bin/sh
browserify lib/client/canny.js -o fe/js/min/fe.js
node app.js

