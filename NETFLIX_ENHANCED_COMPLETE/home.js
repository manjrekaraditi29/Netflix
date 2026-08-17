/* NETFIX HOME PAGE HELPERS */

function playFeatured() {
    playMovie("Interstellar");
}

function addFeatured() {
    const movie = MOVIES.find(movie => movie.id === 1);
    if (!movie) return;
    if (!isInList(movie.id)) {
        toggleMyList(movie.id);
    } else {
        alert("Interstellar is already in My List.");
    }
}
