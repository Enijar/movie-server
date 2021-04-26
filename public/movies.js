const player = document.querySelector(".player");
const cjs = new Castjs();

function openPlayer(torrent) {
  if (!player) {
    throw new Error("No .player element");
  }
  const video = player.querySelector("video");
  if (!video) {
    throw new Error("No video element");
  }
  video.src = `/stream/${torrent}`;
  player.style.pointerEvents = "all";
  player.style.opacity = 1;
  const cast = player.querySelector("#cast");
  if (cast && cjs.available) {
    cast.addEventListener("click", () => {
      cjs.cast(video.src);
    });
  }
}

function closePlayer() {
  if (!player) {
    throw new Error("No .player element");
  }
  const video = player.querySelector("video");
  if (!video) {
    throw new Error("No video element");
  }
  video.src = "";
  player.style.pointerEvents = "none";
  player.style.opacity = 0;
  if (cjs.available) {
    cjs.disconnect();
  }
}

function renderMovies(movies, q = "") {
  return movies
    .filter((movie) => {
      return movie.title.toLowerCase().includes(q);
    })
    .map((movie) => {
      const torrent = movie.torrents[0]?.url ?? "";
      return `
        <div class="card" onclick="openPlayer('${torrent}')">
          <img src="${movie.coverImage}" alt="${movie.title}" loading="lazy" width="500" height="750" />
          <h3>${movie.title}</h3>
        </div>
      `;
    })
    .join("");
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closePlayer();
  }
});

(async () => {
  const res = await fetch("/api/movies");
  const movies = await res.json();

  const app = document.querySelector("#app");
  if (!app) {
    throw new Error("No #app element");
  }
  app.innerHTML = renderMovies(movies);

  const q = document.querySelector("#q");
  if (!q) {
    throw new Error("No #q element");
  }
  q.addEventListener("input", (event) => {
    app.innerHTML = renderMovies(movies, event.target.value);
  });
})();
