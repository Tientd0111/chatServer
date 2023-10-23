const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let UploadFileSchema = new mongoose.Schema({
	fileId: {type: String, default: ''},
	fileName: {type: String, default: ''},
	created_at: { type: Date, default: Date.now},
	created_by: { type: String },
});

UploadFileSchema.plugin(AutoIncrement.plugin, {modelName: 'UploadFile', field:'UID'});
// Export the model
module.exports = mongoose.model('UploadFile', UploadFileSchema);
