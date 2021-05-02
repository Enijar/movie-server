import database from "../services/database";
import updateMovies from "../jobs/update-movies";

database.sync({ alter: true }).then(() => updateMovies());
