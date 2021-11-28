import updateMovies from "./jobs/update-movies";
import updateMovieCoverImages from "./jobs/update-movie-cover-images";

async function run() {
  try {
    await updateMovies();
    await updateMovieCoverImages();
  } catch (err) {
    console.error(err);
  }
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
