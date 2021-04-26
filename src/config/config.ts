import * as path from "path";
import env from "../../env";

export default {
  port: env.port,
  movieData: {
    apiUrl: "https://yts.am/api/v2/list_movies.json",
  },
  database: {
    ...env.database,
    entities: path.resolve(__dirname, "..", "entities"),
  },
  paths: {
    data: path.resolve(__dirname, "..", "..", "data"),
    public: path.resolve(__dirname, "..", "..", "public"),
  },
};
