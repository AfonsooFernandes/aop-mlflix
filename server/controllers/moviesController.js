const Movie = require('../models/Movie');
const Comment = require('../models/Comment');

exports.getAllMovies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 25;
  const search = req.query.search || '';

  const query = search
    ? { title: { $regex: search, $options: 'i' } }
    : {};

  const skip = (page - 1) * pageSize;

  const movies = await Movie.find(query, { title: 1, year: 1, poster: 1 })
    .skip(skip)
    .limit(pageSize);

  const total = await Movie.countDocuments(query);

  res.json({
    movies,
    total,
    page,
    totalPages: Math.ceil(total / pageSize)
  });
};

exports.getMovieDetails = async (req, res) => {
  const { id } = req.params;
  const movie = await Movie.findById(id);
  const comments = await Comment.find({ movie_id: movie._id });
  res.json({ movie, comments });
};