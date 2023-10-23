const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let ConversationSchema = new mongoose.Schema({
    user_1: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    user_2: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
	created_at: { type: Date, default: new Date()},
	updated_at: { type: Date},
});

ConversationSchema.plugin(AutoIncrement.plugin, {modelName: 'Conversation', field:'UID'});
// Export the model
module.exports = mongoose.model('Conversation', ConversationSchema);
