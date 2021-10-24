import { schedule } from "node-cron";
import updateMovies from "../jobs/update-movies";
import updateMovieCoverImages from "../jobs/update-movie-cover-images";

async function run() {
  await updateMovies();
  await updateMovieCoverImages();
}

export default async function scheduler() {
  run().finally(() => schedule("* * */1 * *", run));
}
