const {readFile, writeFile} = require('./fileHandler');

function getMovies() {
    return readFile();
}

function addMovie(title, director, releaseYear, genre) {
    return getMovies().then((movies) => {
        const newMovie = {
            title,
            director,
            releaseYear,
            genre
        };
        movies.push(newMovie);
        return writeFile(movies);
    });
}

function updateMovie(movie, updatedMovie) {
    return getMovies().then((movies) => {
        const movieIndex = movies.findIndex((m) => m === movie);
        if (movieIndex !== -1) {
            movies[movieIndex] = {
                ... movie,
                ... updatedMovie
            };
            return writeFile(movies);
        } else {
            throw new Error('Movie not found.');
        }
    });
}

function deleteMovie(movieIndex) {
    return getMovies().then((movies) => {
        if (movieIndex >= 0 && movieIndex < movies.length) {
            movies.splice(movieIndex, 1);
            return writeFile(movies);
        } else {
            throw new Error('Invalid movie index.');
        }
    });
}

function searchMovies(query) {
    return getMovies().then((movies) => {
        const searchResults = movies.filter((movie) => {
            const {title, director, genre} = movie;
            const lowerCaseQuery = query.toLowerCase();
            return(title.toLowerCase().includes(lowerCaseQuery) || director.toLowerCase().includes(lowerCaseQuery) || genre.toLowerCase().includes(lowerCaseQuery));
        });
        return searchResults;
    });
}

function filterMovies(criteria) {
    return getMovies().then((movies) => {
        const filteredMovies = movies.filter((movie) => {
            for (const key in criteria) {
                if (movie[key] !== criteria[key]) {
                    return false;
                }
            }
            return true;
        });
        return filteredMovies;
    });
}

module.exports = {
    getMovies,
    addMovie,
    updateMovie,
    deleteMovie,
    searchMovies,
    filterMovies
};
