function clearMovies() {
  document.getElementById("movies").replaceChildren();
}

function appendMovie(movie) {
  const mainElement = document.getElementById("movies");

  const articleElement = document.createElement("article");
  articleElement.id = movie.imdbID;

  const posterElement = document.createElement("img");
  posterElement.src = movie.Poster;
  posterElement.alt = movie.Title;
  articleElement.append(posterElement);

  const titleElement = document.createElement("h2");
  titleElement.textContent = movie.Title;
  articleElement.append(titleElement);

  const infoElement = document.createElement("p");
  infoElement.textContent =
      "Runtime " + movie.Runtime + " min • Released on " + movie.Released;
  articleElement.append(infoElement);

  const genresElement = document.createElement("p");
  for (const genre of movie.Genres) {
    const genreElement = document.createElement("span");
    genreElement.className = "genre";
    genreElement.textContent = genre;
    genresElement.append(genreElement);
  }
  articleElement.append(genresElement);

  const plotElement = document.createElement("p");
  plotElement.textContent = movie.Plot;
  articleElement.append(plotElement);

  const directorsHeading = document.createElement("h3");
  directorsHeading.textContent = "Directors";
  articleElement.append(directorsHeading);

  const directorsList = document.createElement("ul");
  for (const director of movie.Directors) {
    const listItem = document.createElement("li");
    listItem.textContent = director;
    directorsList.append(listItem);
  }
  articleElement.append(directorsList);

  const writersHeading = document.createElement("h3");
  writersHeading.textContent = "Writers";
  articleElement.append(writersHeading);

  const writersList = document.createElement("ul");
  for (const writer of movie.Writers) {
    const listItem = document.createElement("li");
    listItem.textContent = writer;
    writersList.append(listItem);
  }
  articleElement.append(writersList);

  const actorsHeading = document.createElement("h3");
  actorsHeading.textContent = "Actors";
  articleElement.append(actorsHeading);

  const actorsList = document.createElement("ul");
  for (const actor of movie.Actors) {
    const listItem = document.createElement("li");
    listItem.textContent = actor;
    actorsList.append(listItem);
  }
  articleElement.append(actorsList);

  const metascoreElement = document.createElement("p");
  metascoreElement.textContent = "Metascore: " + movie.Metascore;
  articleElement.append(metascoreElement);

  const imdbRatingElement = document.createElement("p");
  imdbRatingElement.textContent = "IMDb Rating: " + movie.imdbRating;
  articleElement.append(imdbRatingElement);

  const editButton = document.createElement("button");
  editButton.textContent = "Edit";
  editButton.onclick = function () {
    location.href = "edit.html?imdbID=" + movie.imdbID;
  };
  articleElement.append(editButton);

  mainElement.append(articleElement);
}

function loadMovies(genre) {
  const xhr = new XMLHttpRequest();
  const url = new URL("/movies", window.location.origin);


  if (genre && genre !== "All") {
    url.searchParams.set("genre", genre);
  }

  xhr.open("GET", url);

  xhr.onload = function () {
    const mainElement = document.getElementById("movies");
    clearMovies();

    if (xhr.status === 200) {
      const movies = JSON.parse(xhr.responseText);

      for (const movie of movies) {
        appendMovie(movie);
      }

      if (movies.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No movies found for this genre.";
        mainElement.append(message);
      }
    } else {
      mainElement.textContent =
          "Movies could not be loaded. Status " +
          xhr.status +
          " - " +
          xhr.statusText;
    }
  };

  xhr.send();
}

function addGenreButton(label, genreToLoad) {
  const navElement = document.querySelector("nav");
  const button = document.createElement("button");

  button.type = "button";
  button.textContent = label;
  button.onclick = function () {
    loadMovies(genreToLoad);
  };

  navElement.append(button);
}

window.onload = function () {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", "/genres");

  xhr.onload = function () {
    const navElement = document.querySelector("nav");

    if (xhr.status === 200) {
      const genres = JSON.parse(xhr.responseText);

      navElement.replaceChildren();

      addGenreButton("All", "All");

      for (const genre of genres) {
        addGenreButton(genre, genre);
      }

      const firstButton = navElement.querySelector("button");
      if (firstButton) {
        firstButton.click();
      }
    } else {
      navElement.textContent =
          "Genres could not be loaded. Status " +
          xhr.status +
          " - " +
          xhr.statusText;
    }
  };

  xhr.send();
};