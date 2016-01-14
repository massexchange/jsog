var serialize = require("./");

var b = {
    e: "e",
    f: "f",
    g: {
        h: "h",
        i: "i"
    }
};

var l = {
    n: {
        p: "p"
    },
    o: "o"
};
l.n.q = l;

var d = {
    j: "j",
    k: "k",
    l: l
};
l.m = d;

var a = {
    b: {
        e: "e",
        f: "f",
        g: {
            h: "h",
            i: "i"
        }
    },
    c: "c",
    d: d
};

var expected = '{"b":{"e":"e","f":"f","g":{"h":"h","i":"i"}},"c":"c","d":{"j":"j","k":"k","l":{"n":{"p":"p","q":{"@ref":"0"}},"o":"o","m":{"@ref":"1"},"@id":"0"},"@id":"1"}}';

var result = serialize(a);
result = serialize(a);

var passed = result == expected;

console.log("Passed: " + passed);
if(!passed) {
    console.log("Expected: ", expected);
    console.log("Actual:   ", result);
}
