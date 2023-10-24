const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let UserSchema = new mongoose.Schema({
	username: {min: 6, type: String, required: true, max: 50, lowercase: true,  unique: true},
	name: {type: String, required: true, max: 100},
	nickname: {type: String, default: "", max: 100},
	avatar: {type: String, default: ""},
	cover: {type: String, default: ""},
	password: {type: String, max: 255, default: ''},
	email: {type: String, max: 100, index: true, unique:true, sparse:true},
	phone_number: {type: String, required: true, max: 20, lowercase: true, unique: [true, 'Số điện thoại đã tồn tại!']},
	date_of_birth: {type: Date},
	refresh_token: {type: String, max: 255},
	role: {type: String, required: true},
	created_at: { type: Date, default: new Date()},
	updated_at: { type: Date},
	updated_by: { type: String, default: ''},
	deleted: {type: Boolean, default: false},
	is_block: {type: Boolean, default: false},
	is_online: {type: Boolean, default: false},
	last_login: {type: Date},
	last_logout: {type: Date},
	devices: [String],
});

UserSchema.plugin(AutoIncrement.plugin, {modelName: 'User', field:'UID'});
// Export the model
module.exports = mongoose.model('User', UserSchema);
