const mongoose = require('mongoose')
const Schema = mongoose.Schema


var userSchema = new Schema({
  name: String,
  email: { type: String, required: true, index: { unique: true } },
  password: String,
  projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }]
});

const User = mongoose.model('User', userSchema);

module.exports = User