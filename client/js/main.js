const list = document.getElementById('movie-list');
const pagination = document.createElement('div');
pagination.id = 'pagination';
document.querySelector('.container').appendChild(pagination);

let currentPage = 1;
let totalPages = 1;
let searchTerm = '';

function renderMovies(movies) {
  list.innerHTML = '';
  movies.forEach(movie => {
    const el = document.createElement('div');
    el.className = 'movie-card';
    el.innerHTML = `
      <a href="movie.html?id=${movie._id}">
        <img src="${movie.poster || 'https://via.placeholder.com/150x225?text=No+Image'}" alt="${movie.title}">
        <h3>${movie.title} (${movie.year})</h3>
      </a>
    `;
    list.appendChild(el);
  });
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

  if (currentPage > 1) {
    pagination.appendChild(createButton('Anterior', currentPage - 1));
  }

  pagination.appendChild(createButton(1, 1));

  if (currentPage > 3) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.margin = '0 5px';
    pagination.appendChild(dots);
  }

  const maxPagesToShow = 3;
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  for (let i = startPage; i <= endPage; i++) {
    pagination.appendChild(createButton(i, i));
  }

  if (currentPage < totalPages - 2) {
    const dots = document.createElement('span');
    dots.textContent = '...';
    dots.style.margin = '0 5px';
    pagination.appendChild(dots);
  }

  if (totalPages > 1) {
    pagination.appendChild(createButton(totalPages, totalPages));
  }

  if (currentPage < totalPages) {
    pagination.appendChild(createButton('Seguinte', currentPage + 1));
  }
}

function loadMovies(page = 1) {
  currentPage = page;
  const searchParam = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
  fetch(`/api/movies?page=${page}${searchParam}`)
    .then(res => res.json())
    .then(data => {
      renderMovies(data.movies);
      totalPages = data.totalPages;
      renderPagination();
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