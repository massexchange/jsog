var debug = false;

var ID_PROP = "@id";
var REF_PROP = "@ref";

var LOG = (message, obj) => {
    if(debug)
        console.log(message, obj);
};

var util = {};

util.isObject = function(obj) {
    return typeof obj === "object";
};

var IdGen = () => {
    var nextId = 0;

    return () => nextId++;
};

var serialize = function(obj) {
    try {
        return JSON.stringify(obj);
    }
    catch(e) {
        return JSON.stringify(encodeCycles(obj, IdGen()));
    }
};

var encodeCycles = function(obj, idGen, currVisited) {
    var visited = currVisited || [obj];

    return hasCycle(obj)
      ? Object.keys(obj).map(key => {
            var out = {};

            var field = obj[key];

            if(util.isObject(field)) {
                var fieldIndex = visited.indexOf(field);
                if(fieldIndex >= 0) {
                    var id = field[ID_PROP] || (field[ID_PROP] = idGen().toString());

                    LOG("field: ", field);

                    out[key] = { [REF_PROP]: id };

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

var hasCycle = function(obj) {
    try {
        JSON.stringify(obj);
        return false;
    }
    catch(e) {
        return true;
    }
};

module.exports = serialize;