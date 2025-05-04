document.addEventListener('submit', function (e) {
  if (e.target.matches('#new-comment-form')) {
    e.preventDefault();
    const form = e.target;
    const data = {
      movie_id: form.dataset.movieId,
      name: form.name.value,
      email: form.email.value,
      text: form.text.value,
      date: new Date()
    };
    fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => location.reload());
  }
  
  if (e.target.matches('.edit-form')) {
    e.preventDefault();
    const form = e.target;
    const commentId = form.dataset.id;
    const data = {
      name: form.name.value,
      email: form.email.value,
      text: form.text.value
    };
    fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => location.reload());
  }
});
  
function deleteComment(id) {
  if (confirm('Eliminar este comentário?')) {
    fetch(`/api/comments/${id}`, { method: 'DELETE' })
      .then(() => location.reload());
  }
}  