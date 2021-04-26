import { Router } from "express";
import Movie from "./entities/movie";

const routes = Router();

routes.get("/api/movies", async (req, res) => {
  try {
    const movies = await Movie.findAll();

    res.json(movies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: { server: "Internal server error" } });
  }
});

export default routes;
