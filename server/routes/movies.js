const express = require('express');
const router = express.Router();

const controller = require('../controllers/moviesController');

router.get('/', controller.getAllMovies);
router.get('/:id', controller.getMovieDetails);

module.exports = router;