// ======================================================
// NETFIX MOVIE DETAILS + RATINGS
// ======================================================

const urlParams = new URLSearchParams(window.location.search);
const movieId = Number(urlParams.get("id"));
const movie = MOVIES.find(item => item.id === movieId);
const detailsContainer = document.getElementById("movieDetails");

function ratingHTML(id) {
    const current = getMovieRating(id);
    return `<div class="rating-box">
        <strong>Rate this movie</strong>
        <div class="stars" id="stars-${id}">
            ${[1,2,3,4,5].map(i => `<button class="star ${i <= current ? "selected" : ""}" data-rating="${i}" onclick="rateMovie(${id},${i})">★</button>`).join("")}
        </div>
        <span id="ratingText-${id}">${current ? `Your rating: ${current}/5` : "Not rated yet"}</span>
    </div>`;
}

function rateMovie(id, rating) {
    saveMovieRating(id, rating);
    const stars = document.querySelectorAll(`#stars-${id} .star`);
    stars.forEach((star, index) => star.classList.toggle("selected", index < rating));
    const text = document.getElementById(`ratingText-${id}`);
    if (text) text.textContent = `Your rating: ${rating}/5`;
}

if (movie) {
    document.title = "NETFLIX - " + movie.title;
    detailsContainer.innerHTML = `
        <div class="details-image"><img src="${movie.image}" alt="${movie.title}"></div>
        <div class="details-content">
            <span class="details-label">NETFLIX MOVIE</span>
            <h1>${movie.title}</h1>
            <div class="details-meta"><span>${movie.year}</span><span>${movie.genre}</span><span>HD</span></div>
            <p class="details-description">Get ready for an exciting ${movie.genre} experience with <strong>${movie.title}</strong>. Enjoy your movie experience with NETFLIX.</p>
            <div class="details-buttons">
                <button class="watch-button" onclick="watchMovie(${movie.id})">▶ Watch Now</button>
                <button class="list-button" onclick="addMovieToList(${movie.id})">${isInList(movie.id) ? "✓ In My List" : "+ My List"}</button>
            </div>
            ${ratingHTML(movie.id)}
            <div class="details-extra">
                <p><strong>Genre:</strong> ${movie.genre}</p>
                <p><strong>Release:</strong> ${movie.year}</p>
                <p><strong>Audio:</strong> English</p>
            </div>
        </div>`;
} else {
    detailsContainer.innerHTML = `<div class="movie-not-found"><div class="not-found-icon">🎬</div><h1>Movie Not Found</h1><p>Sorry, we couldn't find the movie you selected.</p><a href="home.html">← Back to Home</a></div>`;
}

function watchMovie(id) { window.location.href = "watch.html?id=" + id; }
function addMovieToList(id) {
    toggleMyList(id);
    const button = document.querySelector(".list-button");
    if (button) button.textContent = isInList(id) ? "✓ In My List" : "+ My List";
}
