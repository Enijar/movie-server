import { Sequelize } from "sequelize-typescript";
import config from "../config/config";

export default new Sequelize({
  ...config.database,
  logging: false,
  models: [config.database.entities],
});
