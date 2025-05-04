const Comment = require('../models/Comment');

exports.getCommentsByMovie = async (req, res) => {
  try {
    const comments = await Comment.find({ movie_id: req.params.movieId }).sort({ date: -1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao procurar comentários.' });
  }
};

exports.createComment = async (req, res) => {
  const { movie_id, name, text } = req.body;
  try {
    const comment = await Comment.create({ movie_id, name, text, date: new Date() });
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar comentário.' });
  }
};

exports.updateComment = async (req, res) => {
  try {
    await Comment.findByIdAndUpdate(req.params.id, { text: req.body.text });
    res.json({ message: 'Comentário atualizado.' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar comentário.' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentário apagado.' });
  } catch (err) {
    res.status(400).json({ error: 'Erro ao apagar comentário.' });
  }
};