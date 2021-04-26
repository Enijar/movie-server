import * as path from "path";
import type { Dialect } from "sequelize";

export default {
  port: 3000,
  database: {
    host: `localhost`,
    name: `yts`,
    dialect: `sqlite` as Dialect,
    storage: path.resolve(__dirname, "data", "database.sqlite"),
  },
};
