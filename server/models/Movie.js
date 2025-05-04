const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  plot: String,
  fullplot: String,
  year: Number,
  poster: String,
  genres: [String], 
  cast: [String]    
});

module.exports = mongoose.model('Movie', movieSchema, 'movies');