const mongoose = require('mongoose')
const Schema = mongoose.Schema

var todoSchema = new Schema({
  name: String,
  description: String,
  status: String,
  due_date: Date,
  creator: { type: Schema.Types.ObjectId, ref: 'User' },
  project: { type: Schema.Types.ObjectId, ref: 'Project' }
});

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo