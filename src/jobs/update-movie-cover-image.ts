import * as fs from "fs";
import * as path from "path";
import config from "../config/config";
import { request } from "../utils";
import { MovieData } from "../config/types";

export async function downloadImage(
  url: string,
  fileName: string
): Promise<string | null> {
  try {
    const res = await request(url);
    return new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(
        path.join(config.paths.data, fileName)
      );
      res.body.pipe(fileStream);
      res.body.on("error", reject);
      fileStream.on("finish", () => {
        resolve(fileName);
      });
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

export default async function updateMovieCoverImage(
  movie: MovieData
): Promise<string> {
  const fileName = `${movie.ytsId}.jpg`;
  if (fs.existsSync(path.join(config.paths.data, fileName))) {
    return fileName;
  }
  try {
    const image = await downloadImage(movie.coverImage, fileName);
    return image ?? movie.coverImage;
  } catch (err) {
    console.error(err);
    return movie.coverImage;
  }
}
