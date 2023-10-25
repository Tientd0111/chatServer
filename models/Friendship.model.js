const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let FriendshipSchema = new mongoose.Schema({
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

FriendshipSchema.plugin(AutoIncrement.plugin, {modelName: 'Friendship', field:'UID'});
// Export the model
module.exports = mongoose.model('Friendship', FriendshipSchema);
