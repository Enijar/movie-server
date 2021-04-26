import database from "./services/database";
import app from "./services/app";

database.sync({ alter: true }).then(app);
