const player = document.querySelector(".player");
const cjs = new Castjs();

const state = {
  casting: false,
};

function videoEvents(video, on) {
  function onPlay() {
    cjs.play();
  }
  function onPause() {
    cjs.pause();
  }
  function onTimeUpdate() {
    cjs.seek(video.currentTime);
  }
  if (on) {
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("timeupdate", onTimeUpdate);
  } else {
    video.removeEventListener("play", onPlay);
    video.removeEventListener("pause", onPause);
    video.removeEventListener("timeupdate", onTimeUpdate);
  }
}

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
    function toggleCast() {
      state.casting = !state.casting;
      if (state.casting) {
        video.muted = true;
        cjs.cast(video.src);
        cjs.seek(video.currentTime);
      } else {
        video.muted = false;
        cjs.disconnect();
      }
      videoEvents(video, state.casting);
    }
    cast.addEventListener("click", toggleCast);
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
    state.casting = false;
    cjs.disconnect();
    videoEvents(video, state.casting);
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
