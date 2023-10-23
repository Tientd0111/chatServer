module.exports = function (user) {
	return {
		_id: user._id,
		username: user.username,
		email: user.email,
		phone_number: user.phone_number,
		name: user.name,
		password: user.password,
	}
}
