var debug = false;

var LOG = (message, obj) => {
    if(debug)
        console.log(message, obj);
};

var util = {};

util.isObject = function(obj) {
    return typeof obj === "object";
};

var hasCycle = function(obj) {
    try {
        JSON.stringify(obj);
        return false;
    }
    catch(e) {
        return true;
    }
};

var serialize = function(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch(e) {
        var idGen = (() => {
            var nextId = 0;

            return () => nextId++;
        })();

        return JSON.stringify(encodeCycles(obj, idGen));
    }
};

var encodeCycles = function(obj, idGen, currVisited) {
    var visited = currVisited || [obj];

    return hasCycle(obj)
      ? Object.keys(obj).map(function(key) {
            var out = {};

            var field = obj[key];

            if(util.isObject(field)) {
                var fieldIndex = visited.indexOf(field);
                if(fieldIndex >= 0) {
                    var id = field["@id"] || (field["@id"] = idGen().toString());

                    LOG("field: ", field);

                    out[key] = { "@ref": id };

                    return out;
                }
                else
                    visited.push(field);

                out[key] = encodeCycles(field, idGen, visited);

                LOG("encoded: ", out[key]);
            }
            else out[key] = field;

            return out;
        }).reduce(function(obj, field) {
            return Object.assign(obj, field);
        }, {})
      : obj;
};

module.exports = serialize;