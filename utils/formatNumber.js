module.exports = function (num) {
	return String(num).replace(/\B(?=(\d{3})+(?!\d))/g,',') + ' VNĐ'
}
