const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const movieModel = require("./movie-model.js");

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "files")));

app.get("/movies", function (req, res) {
  const genre = req.query.genre;

  let movies = Object.values(movieModel);

  if (genre) {
    movies = movies.filter(function (movie) {
      return movie.Genres.includes(genre);
    });
  }

  res.json(movies);
});

app.get("/genres", function (req, res) {
  const genres = [...new Set(
      Object.values(movieModel).flatMap(function (movie) {
        return movie.Genres;
      })
  )].sort();

  res.json(genres);
});

app.get("/movies/:imdbID", function (req, res) {
  const imdbID = req.params.imdbID;
  const movie = movieModel[imdbID];

  if (movie) {
    res.json(movie);
  } else {
    res.sendStatus(404);
  }
});

app.put("/movies/:imdbID", function (req, res) {
  const imdbID = req.params.imdbID;
  const movie = req.body;

  movie.imdbID = imdbID;

  const exists = movieModel[imdbID] !== undefined;
  movieModel[imdbID] = movie;

  if (exists) {
    res.sendStatus(200);
  } else {
    res.status(201).json(movie);
  }
});

app.listen(3000);

console.log("Server now listening on http://localhost:3000/");