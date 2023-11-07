const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const AutoIncrement = require('mongoose-auto-increment-reworked').MongooseAutoIncrementID;

let NotificationSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  friendship_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Friendship'
  },
  type: { type: Number }, // 1: sent message | 2: call | 3: added you
  created_at: { type: Date, default: new Date() },
  updated_at: { type: Date },
});
NotificationSchema.index({from: 1});
NotificationSchema.plugin(AutoIncrement.plugin, { modelName: 'Notification', field: 'UID' });
// Export the model
module.exports = mongoose.model('Notification', NotificationSchema);
