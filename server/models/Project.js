const mongoose = require('mongoose')
const Schema = mongoose.Schema

var projectSchema = new Schema({
  name: String,
  description: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project