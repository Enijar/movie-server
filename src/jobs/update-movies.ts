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
import { Op } from "sequelize";

async function saveMovies(movies: any[]): Promise<Movie[]> {
  const movieData: MovieData[] = [];
  for (let i = 0, length = movies.length; i < length; i++) {
    const movie = movies[i];
    if (!MOVIE_LANGUAGES.includes(movie.language)) continue;
    const torrents: Torrent[] = [];
    movie.torrents.forEach((torrent: any) => {
      if (torrent.quality !== TORRENT_QUALITY) return;
      torrents.push({
        url: torrent.url,
        hash: torrent.hash,
        quality: torrent.quality,
        seeds: torrent.seeds,
        peers: torrent.peers,
        size: torrent.size_bytes / 1e9,
      });
    });
    const torrent = torrents[0] ?? null;
    if (!torrent) continue;
    movieData.push({
      ytsId: movie.id,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      runtime: movie.runtime,
      summary: movie.summary,
      coverImage: movie.large_cover_image,
      torrent,
    });
  }

  if (movies.length === 0) return [];
  try {
    const coverImages = await Promise.all(movieData.map(updateMovieCoverImage));
    for (let i = 0, length = movieData.length; i < length; i++) {
      movieData[i].coverImage = coverImages[i];
    }
    const moviesToUpdate = await Movie.findAll({
      where: {
        ytsId: {
          [Op.in]: movieData.map((item) => item.ytsId),
        },
      },
    });
    await Promise.all(
      moviesToUpdate.map((item) => {
        const movie = movieData.find(({ ytsId }) => ytsId === item.ytsId);
        if (!movie) return null;
        return item.update(movie);
      })
    );
    return await Movie.bulkCreate(movieData, { ignoreDuplicates: true });
  } catch (err) {
    console.error("Failed to save movies:", err.message);
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
