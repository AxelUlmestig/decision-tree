const id = x => x

const max = (a, b, extract = id) => {
    if(extract(a) > extract(b)) return a;
    return b;
}

const isUnique = (v, i, a) => a.indexOf(v) === i

const negate = f => (...args) => !f.apply(f, args)

const mapObj = (obj, f) => {
    const output = {};
    Object.keys(obj).forEach(key => output[key] = f(obj[key], key))
    return output;
}

const reduceObj = (obj, f, init) =>
    Object.keys(obj).reduce((mem, key) => f(mem, obj[key], key), init)

module.exports = {
    id: id,
    max: max,
    isUnique: isUnique,
    negate: negate,
    mapObj, mapObj,
    reduceObj: reduceObj
}
