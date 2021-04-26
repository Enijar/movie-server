import fetch from "node-fetch";

export default class Request {
  get(url: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        resolve(data);
      } catch (err) {
        reject(err);
      }
    });
  }
}
