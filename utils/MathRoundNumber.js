module.exports = function (num) {
	return Math.sign(num) * (Math.round((Math.abs(num) + Number.EPSILON) * 1e2) / 1e2);
}
