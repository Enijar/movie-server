import * as express from "express";
import { json } from "body-parser";
import * as cors from "cors";
import * as proxy from "express-http-proxy";
import config from "../config/config";
import routes from "../routes";
import scheduler from "./scheduler";

export default function app() {
  const app = express();
  app.use(json());
  app.use(cors());
  app.use(express.static(config.paths.public));
  app.use(express.static(config.paths.data));
  app.use(routes);
  scheduler();

  app.get("*", proxy("http://localhost:3001"));

  app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
  });
}
