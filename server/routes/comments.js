const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.get('/:movieId', commentsController.getCommentsByMovie);

router.post('/', commentsController.createComment);
router.put('/:id', commentsController.updateComment);
router.delete('/:id', commentsController.deleteComment);

module.exports = router;