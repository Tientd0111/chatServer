module.exports = function getKeyByValue(object, value) { return Object.keys(object).filter(key => object[key] === value); }
