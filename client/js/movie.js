document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const container = document.getElementById('movie-details');

  if (!container || !id) return;

  fetch(`/api/movies/${id}`)
    .then(res => res.json())
    .then(({ movie }) => {
      document.title = `${movie.title} (${movie.year}) - CineVault`;
    
      container.innerHTML = `
        <h2>${movie.title} (${movie.year})</h2>
        <img src="${movie.poster || 'https://via.placeholder.com/200x300?text=No+Image'}" alt="${movie.title}">
        <p>${movie.fullplot || 'Sem sinopse disponível.'}</p>
    
        <h3>Géneros</h3>
        <div>
          ${(movie.genres || []).map(g => `<span class="genre-card">${g}</span>`).join('')}
        </div>
    
        <h3>Comentários</h3>
        <ul id="comment-list"></ul>
    
        <button id="toggle-comment-form" class="primary-btn">Adicionar Comentário</button>
    
        <form id="comment-form" class="hidden">
          <input type="text" id="name" placeholder="Seu nome" required />
          <textarea id="text" placeholder="Comentário" required></textarea>
          <button type="submit" class="submit-btn">Enviar</button>
        </form>
    
        <a href="index.html?page=1">⬅ Voltar</a>
      `;    

      attachCommentHandlers();
      loadComments();
    })
    .catch(err => {
      container.innerHTML = '<p>Erro ao carregar detalhes do filme.</p>';
      console.error(err);
    });

  function attachCommentHandlers() {
    const commentForm = document.getElementById('comment-form');
    const commentList = document.getElementById('comment-list');
    const toggleBtn = document.getElementById('toggle-comment-form');

    toggleBtn.addEventListener('click', () => {
      commentForm.classList.toggle('visible');
      toggleBtn.textContent = commentForm.classList.contains('visible')
        ? 'Cancelar'
        : 'Adicionar Comentário';
    });

    commentForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const text = document.getElementById('text').value.trim();
      if (!name || !text) return;

      fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ movie_id: id, name, text })
      }).then(() => {
        commentForm.reset();
        commentForm.classList.remove('visible');
        toggleBtn.textContent = 'Adicionar Comentário';
        loadComments();
      });
    });

    commentList.addEventListener('click', e => {
      const li = e.target.closest('li');
      const commentId = li?.dataset.id;
      if (!commentId) return;

      if (e.target.closest('.delete')) {
        fetch(`/api/comments/${commentId}`, { method: 'DELETE' })
          .then(() => loadComments());
      }

      if (e.target.closest('.edit')) {
        const span = li.querySelector('.text');
        const newText = prompt('Editar comentário:', span.textContent);
        if (newText && newText !== span.textContent) {
          fetch(`/api/comments/${commentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText })
          }).then(() => loadComments());
        }
      }
    });
  }

  function loadComments() {
    const commentList = document.getElementById('comment-list');
    fetch(`/api/comments/${id}`)
      .then(res => res.json())
      .then(comments => {
        commentList.innerHTML = comments.map(c => `
          <li data-id="${c._id}">
            <b>${c.name}</b>: <span class="text">${c.text}</span>
            <div class="comment-actions">
              <button class="edit" title="Editar">
                <img src="icons/edit.svg" alt="Editar" />
              </button>
              <button class="delete" title="Apagar">
                <img src="icons/delete.svg" alt="Apagar" />
              </button>
            </div>
          </li>
        `).join('');
      })
      .catch(err => {
        console.error(err);
        commentList.innerHTML = `<p style="color: red;">Erro ao carregar comentários.</p>`;
      });
  }
});