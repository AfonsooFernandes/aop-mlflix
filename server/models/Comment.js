const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  movie_id: mongoose.Schema.Types.ObjectId,
  name: String,
  email: String,
  text: String,
  date: Date
});

module.exports = mongoose.model('Comment', commentSchema, 'comments');