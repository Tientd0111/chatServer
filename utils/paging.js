exports.pageSize = function (req) {
	return req.body.pageSize ? req.body.pageSize : 5
}

exports.pageNumber = function (req) {
	return req.body.pageNumber ? req.body.pageNumber : 0
}