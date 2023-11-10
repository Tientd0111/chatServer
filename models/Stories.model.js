const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let StorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    file: {type: String},
    deleted:{type: Number, default: 0},
	created_at: { type: Date, default: new Date()},
	updated_at: { type: Date},
});
StorySchema.index({user:1});
StorySchema.plugin(AutoIncrement.plugin, {modelName: 'Story', field:'UID'});
// Export the model
module.exports = mongoose.model('Story', StorySchema);
