import config from "../config/config";
import { MovieData, Torrent } from "../config/types";
import Movie from "../entities/movie";
import {
  MOVIE_LANGUAGES,
  MOVIE_MAX_PAGES,
  REQUEST_MAX_RETRIES,
  TORRENT_QUALITY,
} from "../config/consts";
import { request } from "../utils";
import updateMovieCoverImage from "./update-movie-cover-image";

async function saveMovies(movies: any[]): Promise<Movie[]> {
  const movieData: MovieData[] = [];
  movies.forEach((movie) => {
    if (!MOVIE_LANGUAGES.includes(movie.language)) return;
    const torrents: Torrent[] = [];
    movie.torrents.forEach((torrent: any) => {
      if (torrent.quality !== TORRENT_QUALITY) return;
      torrents.push({
        url: torrent.url,
        hash: torrent.hash,
        quality: torrent.quality,
        seeds: torrent.seeds,
        peers: torrent.peers,
        size: torrent.size,
      });
    });
    movieData.push({
      ytsId: movie.id,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      runtime: movie.runtime,
      summary: movie.summary,
      coverImage: movie.large_cover_image,
      torrents,
    });
  });

  if (movies.length === 0) return [];
  try {
    await Promise.all(movieData.map(updateMovieCoverImage));
    return await Movie.bulkCreate(movieData, {
      ignoreDuplicates: true,
    });
  } catch (err) {
    console.log("Failed to save movies:", err.message);
  }
  return [];
}

let failedRetries = 0;
let fetchNextPage = false;
export default async function updateMovies(page = 1) {
  const url = `${config.movieData.apiUrl}?sort_by=download_count&quality=1080p&limit=50&page=${page}`;
  try {
    console.log(`[page ${page}] Fetching movies...`);
    const res = await request(url);
    const json = await res.json();
    const movies = await saveMovies(json?.data?.movies ?? []);
    fetchNextPage = movies.length > 0;
    failedRetries = 0;
  } catch (err) {
    failedRetries++;
    console.error(`Error fetching movies (retry Nº ${failedRetries}):`, err);
  } finally {
    if (
      failedRetries < REQUEST_MAX_RETRIES &&
      fetchNextPage &&
      page < MOVIE_MAX_PAGES
    ) {
      await updateMovies(page + 1);
    }
  }
}
