import * as fs from "fs/promises";
import * as path from "path";
import { chunk } from "lodash";
import config from "../config/config";
import Movie from "../entities/movie";
import { downloadImage } from "./update-movie-cover-image";

export default async function updateMovieCoverImages() {
  const movies = await Movie.findAll();
  const movieChunks = chunk(movies, 20);
  for (let i = 0, length = movieChunks.length; i < length; i++) {
    await Promise.all(
      movieChunks[i].map(async (movie) => {
        const fileName = `${movies[i].ytsId}.jpg`;
        try {
          await fs.access(path.join(config.paths.data, fileName));
        } catch {
          // Cover image doesn't exist, so download it
          await downloadImage(movie.coverImage, fileName);
        }
      })
    );
  }
}
