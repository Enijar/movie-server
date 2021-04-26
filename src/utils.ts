import * as fs from "fs";
import fetch, { Response } from "node-fetch";
import { REQUEST_TIMEOUT } from "./config/consts";

export function request(url: string, options: any = {}): Promise<Response> {
  const { signal, abort } = new AbortController();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(abort, REQUEST_TIMEOUT);
    fetch(url, { ...options, signal })
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeout));
  });
}

export function downloadFile(url: string, filePath: string) {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await request(url);
      const fileStream = fs.createWriteStream(filePath);
      res.body.pipe(fileStream);
      res.body.on("error", (err) => reject(err));
      fileStream.on("finish", () => resolve(undefined));
    } catch (err) {
      reject(err);
    }
  });
}
