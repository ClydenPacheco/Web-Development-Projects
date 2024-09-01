let currentPage = 1;
let currentQuery = '';
let isLoading = false;
let movieList = [];

const searchMovies = () => {
    currentQuery = document.getElementById('search-bar').value;
    if (currentQuery.length > 0) {
        currentPage = 1;
        movieList = [];
        document.getElementById('movie-container').innerHTML = '';
        fetchMovies(currentQuery, currentPage);
    } else {
        document.getElementById('movie-container').innerHTML = '<p>Please enter a movie name.</p>';
    }
};

document.getElementById('search-button').addEventListener('click', searchMovies);

document.getElementById('search-bar').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

document.getElementById('sort-criteria').addEventListener('change', sortMovies);
document.getElementById('sort-order').addEventListener('change', sortMovies);

function fetchMovies(query, page) {
    if (isLoading) return;
    isLoading = true;

    const apiKey = '684bdb0';
    fetch(`https://www.omdbapi.com/?s=${query}&page=${page}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "True") {
                movieList = movieList.concat(data.Search);
                sortMovies();
                isLoading = false;
            } else if (page === 1) {
                document.getElementById('movie-container').innerHTML = '<p>No results found</p>';
                isLoading = false;
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            isLoading = false;
        });
}

function sortMovies() {
    const criteria = document.getElementById('sort-criteria').value;
    const order = document.getElementById('sort-order').value;

    movieList.sort((a, b) => {
        let valA, valB;
        if (criteria === 'name') {
            valA = a.Title.toLowerCase();
            valB = b.Title.toLowerCase();
        } else {
            valA = parseInt(a.Year);
            valB = parseInt(b.Year);
        }

        if (valA < valB) return order === 'asc' ? -1 : 1;
        if (valA > valB) return order === 'asc' ? 1 : -1;
        return 0;
    });

    displayMovies(movieList);
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movie-container');
    movieContainer.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';

        let runtimeInfo = '';
        if (movie.Runtime) {
            runtimeInfo = `<p><strong>Runtime:</strong> ${movie.Runtime}</p>`;
        }

        movieCard.innerHTML = `
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
            <h4>${movie.Title}</h4>
            <p>${movie.Year}</p>
            <div id="learn-more">
                Learn More
            </div>`;

        movieCard.addEventListener('click', () => displayDescription(movie.imdbID));
        movieContainer.appendChild(movieCard);
    });
}

function displayDescription(imdbID) {
    const apiKey = '684bdb0';
    fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const iframe = document.getElementById('iframe-container');
            iframe.src = `data:text/html,${generateIframeContent(data)}`;
        })
        .catch(error => console.error('Error fetching description:', error));
}

function generateIframeContent(movie) {
    return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${movie.Title} (${movie.Year})</h2>
            <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}" style="max-width: 200px;">
            <p><strong>Rated:</strong> ${movie.Rated}</p>
            <p><strong>Released:</strong> ${movie.Released}</p>
            <p><strong>Runtime:</strong> ${movie.Runtime}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Language:</strong> ${movie.Language}</p>
            <p><strong>Awards:</strong> ${movie.Awards}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
        </div>
    `;
}

// Infinite scroll event
window.addEventListener('scroll', function () {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 500 && !isLoading) {
        currentPage++;
        fetchMovies(currentQuery, currentPage);
    }
});
