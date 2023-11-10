const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let ReactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    message:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Message'
    },
    reaction: {type: Number}, // 0: like, 1: love, 2: angry, 3: sad,
	created_at: { type: Date, default: new Date()},
	updated_at: { type: Date},
});

ReactionSchema.index({user: 1, message: 1});
ReactionSchema.plugin(AutoIncrement.plugin, {modelName: 'Reaction', field:'UID'});
// Export the model
module.exports = mongoose.model('Reaction', ReactionSchema);
