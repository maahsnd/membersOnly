const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  time_stamp: { type: Date, required: true, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Message', MessageSchema);
