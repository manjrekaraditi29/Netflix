// ======================================================
// NETFIX WATCH MOVIE
// Continue Watching + Watch History
// ======================================================

const watchParams = new URLSearchParams(window.location.search);
const watchMovieId = Number(watchParams.get("id"));
const watchMovieData = MOVIES.find(movie => movie.id === watchMovieId);
const player = document.getElementById("moviePlayer");

if (watchMovieData) {
    document.title = "NETFLIX - " + watchMovieData.title;
    document.getElementById("watchTitle").textContent = watchMovieData.title;
    document.getElementById("watchMovieTitle").textContent = watchMovieData.title;
    document.getElementById("watchMovieInfo").textContent = watchMovieData.year + " • " + watchMovieData.genre + " • HD";
    player.poster = watchMovieData.image;

    const saved = getContinueWatching()[watchMovieId];
    player.addEventListener("loadedmetadata", () => {
        if (saved && saved.progress > 0 && saved.progress < 0.95) {
            const shouldResume = confirm(`Resume ${watchMovieData.title} from where you stopped?`);
            if (shouldResume) player.currentTime = saved.progress * player.duration;
        }
    });

    let lastSaved = 0;
    function saveProgress() {
        if (!player.duration || !isFinite(player.duration)) return;
        const progress = player.currentTime / player.duration;
        if (progress >= 0.97) {
            removeFromContinue(watchMovieId);
        } else {
            recordWatchStart(watchMovieId, progress, player.duration);
        }
        lastSaved = Date.now();
    }

    player.addEventListener("play", () => recordWatchStart(watchMovieId, player.duration ? player.currentTime / player.duration : 0, player.duration || 0));
    player.addEventListener("timeupdate", () => {
        if (Date.now() - lastSaved > 5000) saveProgress();
    });
    player.addEventListener("pause", saveProgress);
    player.addEventListener("ended", () => removeFromContinue(watchMovieId));
    window.addEventListener("beforeunload", saveProgress);
} else {
    document.getElementById("watchTitle").textContent = "Movie Not Found";
    document.getElementById("watchMovieTitle").textContent = "Movie Not Found";
    document.getElementById("watchMovieInfo").textContent = "The selected movie could not be found.";
}

function goBackToDetails() { window.location.href = "movie-details.html?id=" + watchMovieId; }
function goHome() { window.location.href = "home.html"; }
