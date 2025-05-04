const list = document.getElementById('movie-list');
const pagination = document.createElement('div');
pagination.id = 'pagination';
document.querySelector('.container').appendChild(pagination);

let currentPage = 1;
let totalPages = 1;
let searchTerm = '';

function renderMoviesByGenre(movies) {
  list.innerHTML = '';

  if (!movies || movies.length === 0) {
    list.innerHTML = '<p style="text-align:center;">Nenhum filme encontrado.</p>';
    return;
  }

  const genres = {};

  movies.forEach(movie => {
    if (Array.isArray(movie.genres)) {
      movie.genres.forEach(genre => {
        if (!genres[genre]) genres[genre] = [];
        genres[genre].push(movie);
      });
    } else {
      if (!genres['Sem género']) genres['Sem género'] = [];
      genres['Sem género'].push(movie);
    }
  });

  for (const genre in genres) {
    const section = document.createElement('section');
    section.classList.add('genre-section');

    const title = document.createElement('h2');
    title.textContent = genre;
    section.appendChild(title);

    const row = document.createElement('div');
    row.className = 'movie-row';

    genres[genre].slice(0, 10).forEach(movie => {
      const card = document.createElement('div');
      card.className = 'movie-card small';
      card.innerHTML = `
        <a href="movie.html?id=${movie._id}">
          <img src="${movie.poster || 'https://via.placeholder.com/150x225?text=Sem+Imagem'}" alt="${movie.title}">
          <h3>${movie.title} (${movie.year})</h3>
        </a>
      `;
      row.appendChild(card);
    });

    section.appendChild(row);
    list.appendChild(section);
  }
}

function renderPagination() {
  pagination.innerHTML = '';

  const createButton = (text, page, disabled = false) => {
    const btn = document.createElement('button');
    btn.textContent = text;
    btn.disabled = disabled || page === currentPage;
    btn.addEventListener('click', () => loadMovies(page));
    return btn;
  };

  if (currentPage > 1) pagination.appendChild(createButton('Anterior', currentPage - 1));
  pagination.appendChild(createButton(1, 1));

  if (currentPage > 3) pagination.appendChild(document.createTextNode('...'));

  const maxPagesToShow = 3;
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createButton(i, i));
  }

  if (currentPage < totalPages - 2) pagination.appendChild(document.createTextNode('...'));

  if (totalPages > 1) pagination.appendChild(createButton(totalPages, totalPages));
  if (currentPage < totalPages) pagination.appendChild(createButton('Seguinte', currentPage + 1));
}

function loadMovies(page = 1) {
  currentPage = page;
  const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
  fetch(`/api/movies?page=${page}${searchParam}`)
    .then(res => res.json())
    .then(data => {
      renderMoviesByGenre(data.movies);
      totalPages = data.totalPages;
      renderPagination();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(err => console.error('Erro ao carregar filmes:', err));
}

const urlParams = new URLSearchParams(window.location.search);
const pageParam = parseInt(urlParams.get('page')) || 1;
loadMovies(pageParam);

document.getElementById('search').addEventListener('input', function () {
  searchTerm = this.value.trim();
  loadMovies(1);
});