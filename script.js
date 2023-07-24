// Declaring constants to get the html element by their id
const API_KEY = '81eb5132'; 
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const favoriteMoviesList = document.getElementById('favoriteMoviesList');
const BASE_URL = 'https://www.omdbapi.com/';

let favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies')) || [];

// Function to fetch movie details by ID
async function fetchMovieDetails(movieId) {
  const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&i=${movieId}`);
  const data = await response.json();
  return data;
}

// Function to render search results
function renderSearchResults(movies) {
  searchResults.innerHTML = '';
  movies.forEach((movie) => {
    const movieItem = document.createElement('div');
    movieItem.classList.add('card', 'mb-2', 'd-flex');
    movieItem.innerHTML = `
      <img src="${movie.Poster}" class="card-img-left" alt="${movie.Title} Poster" style="max-height: 150px; max-width: 100px;">
      <div class="card-body">
        <h5 class="card-title">${movie.Title}</h5>
        <p class="card-text">Year: ${movie.Year}</p>
        <p class="card-text">Type: ${movie.Type}</p>
        <button class="btn btn-primary mr-2" onclick="addToFavorites('${movie.imdbID}')">Add to Favorites</button>
        <a href="movie.html?id=${movie.imdbID}" class="btn btn-secondary">More Info</a>
      </div>
    `;
    searchResults.appendChild(movieItem);
  });
}

// Function to render movie details on the movie page
async function renderMovieDetails(movieId) {
  try {
    const movieData = await fetchMovieDetails(movieId);
    const movieDetailsContainer = document.getElementById('movieDetails');

    // Create elements to display movie details
    const movieTitle = document.createElement('h2');
    movieTitle.textContent = movieData.Title;

    const moviePoster = document.createElement('img');
    moviePoster.src = movieData.Poster;
    moviePoster.alt = `${movieData.Title} Poster`;
    moviePoster.style.maxHeight = '500px'; 

    const movieRating = document.createElement('p');
    movieRating.textContent = `Rating: ${movieData.imdbRating}`;

    const movieGenre = document.createElement('p');
    movieGenre.textContent = `Genre: ${movieData.Genre}`;

    const movieRuntime = document.createElement('p');
    movieRuntime.textContent = `Runtime: ${movieData.Runtime}`;

    const movieDirector = document.createElement('p');
    movieDirector.textContent = `Director: ${movieData.Director}`;

    const movieActors = document.createElement('p');
    movieActors.textContent = `Actors: ${movieData.Actors}`;

    const moviePlot = document.createElement('p');
    moviePlot.textContent = `Plot: ${movieData.Plot}`;

    // Append movie details to the container
    movieDetailsContainer.innerHTML = `<h1>Movie Details:</h1>`;
    movieDetailsContainer.appendChild(movieTitle);
    movieDetailsContainer.appendChild(moviePoster);
    movieDetailsContainer.appendChild(movieRating);
    movieDetailsContainer.appendChild(movieGenre);
    movieDetailsContainer.appendChild(movieRuntime);
    movieDetailsContainer.appendChild(movieDirector);
    movieDetailsContainer.appendChild(movieActors);
    movieDetailsContainer.appendChild(moviePlot);
  } catch (error) {
    console.log(`Error fetching movie details for ID ${movieId}:`, error);
  }
}


if (window.location.pathname.includes('movie.html')) {
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get('id');
  if (movieId) {
    renderMovieDetails(movieId);
  }
}

// Function to add a movie to favorites
function addToFavorites(movieId) {
  if (!favoriteMovies.includes(movieId)) {
    favoriteMovies.push(movieId);
    localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
  }
}

// Function to render favorite movies list
async function renderFavoriteMovies() {
  favoriteMoviesList.innerHTML = '';

  if (favoriteMovies.length === 0) {
    favoriteMoviesList.innerHTML = '<p>No favorite movies added yet.</p>';
    return;
  }

  for (const movieId of favoriteMovies) {
    try {
      const movieData = await fetchMovieDetails(movieId);
      if (movieData && movieData.Title) {
        const movieItem = document.createElement('li');
        movieItem.classList.add('list-group-item', 'd-flex', 'align-items-center');

        // Create elements for the movie poster and details
        const moviePoster = document.createElement('img');
        moviePoster.src = movieData.Poster;
        moviePoster.alt = `${movieData.Title} Poster`;
        moviePoster.style.maxHeight = '150px'; // Adjust the maximum height of the poster image

        const movieDetails = document.createElement('div');
        movieDetails.classList.add('ml-3');
        movieDetails.innerHTML = `
          <h5>${movieData.Title} (${movieData.Year})</h5>
          <button class="btn btn-danger" onclick="removeFromFavorites('${movieId}')">Remove</button>
        `;

        // Append movie poster and details to the container
        movieItem.appendChild(moviePoster);
        movieItem.appendChild(movieDetails);
        
        favoriteMoviesList.appendChild(movieItem);
      } else {
        console.log(`Movie details not found for ID ${movieId}. Skipping rendering.`);
      }
    } catch (error) {
      console.log(`Error fetching movie details for ID ${movieId}:`, error);
    }
  }
}

// Function to remove a movie from favorites
function removeFromFavorites(movieId) {
  favoriteMovies = favoriteMovies.filter((id) => id !== movieId);
  localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
  renderFavoriteMovies();
}

// Event listener for search input
if (window.location.pathname.includes('index.html')) {
  searchInput.addEventListener('input', (event) => {
    const query = event.target.value;
    if (query.length >= 3) {
      fetch(`${BASE_URL}?apikey=${API_KEY}&s=${query}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.Search) {
            renderSearchResults(data.Search);
          }
        });
    } else {
      searchResults.innerHTML = '';
    }
  });
}

// Check if we are on the favorite movies page and render the list
if (window.location.pathname.includes('favorites.html')) {
  renderFavoriteMovies();
}