import { schedule } from "node-cron";
import updateMovies from "../jobs/update-movies";
import updateMovieCoverImages from "../jobs/update-movie-cover-images";

async function run() {
  try {
    await updateMovies();
    await updateMovieCoverImages();
  } catch (err) {
    console.error(err);
  }
}

export default async function scheduler() {
  schedule("* * */1 * *", run);
}
