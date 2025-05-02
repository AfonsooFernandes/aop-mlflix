const params = new URLSearchParams(window.location.search);
const id = params.get('id');

fetch(`/api/movies/${id}`)
  .then(res => res.json())
  .then(({ movie, comments }) => {
    const div = document.getElementById('movie-details');
    div.innerHTML = `
      <h2>${movie.title} (${movie.year})</h2>
      <img src="${movie.poster}" width="200">
      <p>${movie.fullplot}</p>
      <h3>Comentários</h3>
      <ul>
        ${comments.map(c => `<li><b>${c.name}</b>: ${c.text}</li>`).join('')}
      </ul>
      <a href="/">⬅ Voltar</a>
    `;
});