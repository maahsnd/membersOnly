const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true, maxLength: 1000 },
  time_stamp: {
    type: Date,
    default: Date.now
  },
  author: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Message', MessageSchema);
