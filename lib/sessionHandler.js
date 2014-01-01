/**
 * Just saves objects and handle it with an id
 * TODO: generate id with timestamp
 */

var sessionHandler = function (idPrefix) {
    "use strict";

    var id = 0,
        session = {};

    return {
        save : function (object) {
            var gId = idPrefix + id;
            id++;
            session[gId] = object;
            return gId;
        },
        session : session
    };
};

module.exports = sessionHandler;