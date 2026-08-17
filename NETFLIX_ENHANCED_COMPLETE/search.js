// ======================================================
// NETFIX ADVANCED SEARCH + GENRE FILTERS
// ======================================================

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const genreFilter = document.getElementById("genreFilter");
const yearFilter = document.getElementById("yearFilter");
const ratingFilter = document.getElementById("ratingFilter");
const sortFilter = document.getElementById("sortFilter");
const results = document.getElementById("searchResults");
const resultsTitle = document.getElementById("resultsTitle");

function setupFilters() {
    if (!genreFilter) return;
    [...new Set(MOVIES.map(m => m.genre))].sort().forEach(genre => {
        genreFilter.insertAdjacentHTML("beforeend", `<option value="${genre}">${genre}</option>`);
    });
    [...new Set(MOVIES.map(m => m.year))].sort((a, b) => b - a).forEach(year => {
        yearFilter.insertAdjacentHTML("beforeend", `<option value="${year}">${year}</option>`);
    });
}

function runSearch() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const genre = genreFilter?.value || "all";
    const year = yearFilter?.value || "all";
    const rating = ratingFilter?.value || "all";
    const sort = sortFilter?.value || "default";

    let filtered = MOVIES.filter(movie => {
        const matchesQuery = !query || movie.title.toLowerCase().includes(query) || movie.genre.toLowerCase().includes(query) || String(movie.year).includes(query);
        const matchesGenre = genre === "all" || movie.genre === genre;
        const matchesYear = year === "all" || String(movie.year) === year;
        const movieRating = getMovieRating(movie.id);
        const matchesRating = rating === "all" || movieRating >= Number(rating);
        return matchesQuery && matchesGenre && matchesYear && matchesRating;
    });

    if (sort === "newest") filtered.sort((a, b) => b.year - a.year);
    if (sort === "oldest") filtered.sort((a, b) => a.year - b.year);
    if (sort === "az") filtered.sort((a, b) => a.title.localeCompare(b.title));

    resultsTitle.textContent = query ? `Results for "${query}"` : "Explore";
    renderMovies("searchResults", filtered);
}

setupFilters();

const requestedGenre = new URLSearchParams(window.location.search).get("genre");
if (requestedGenre && genreFilter && [...genreFilter.options].some(option => option.value === requestedGenre)) {
    genreFilter.value = requestedGenre;
}

runSearch();
searchButton?.addEventListener("click", runSearch);
searchInput?.addEventListener("input", runSearch);
[genreFilter, yearFilter, ratingFilter, sortFilter].forEach(el => el?.addEventListener("change", runSearch));
