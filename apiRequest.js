const fetch = require('node-fetch');

const API_KEY = '29112332';
const API_URL = 'https://www.omdbapi.com/';

function fetchMovies(searchQuery) {
    const url = `${API_URL}?s=${
        encodeURIComponent(searchQuery)
    }&type=movie&apikey=${API_KEY}`;

    return fetch(url).then((response) => response.json()).then((data) => {
        if (data.Response === 'False') {
            throw new Error(data.Error);
        } else {
            const movies = data.Search.map((movie) => ({title: movie.Title, director: '', releaseYear: movie.Year, genre: ''}));
            return movies;
        }
    }).catch((error) => {
        throw new Error(`Failed to fetch movie data: ${
            error.message
        }`);
    });
}

module.exports = {
    fetchMovies
};
