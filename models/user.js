const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  family_name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  membership_status: { type: Boolean, required: true, default: false }
});

UserSchema.virtual('full_name').get(function () {
  return this.first_name + ' ' + this.family_name;
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
