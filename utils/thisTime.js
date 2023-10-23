const momenttz = require('moment-timezone')
const moment = require("moment");

module.exports = function () {
	return moment(momenttz.tz(Date.now(), "Asia/Ho_Chi_Minh").toDate()).format("YYYY-MM-DD")
}
