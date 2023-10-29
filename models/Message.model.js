const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let ConversationSchema = new mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Conversation'
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {type: String},
    message_image:{type: Array},
	created_at: { type: Date, default: new Date()},
	updated_at: { type: Date},
});

ConversationSchema.plugin(AutoIncrement.plugin, {modelName: 'Message', field:'UID'});
// Export the model
module.exports = mongoose.model('Message', ConversationSchema);
