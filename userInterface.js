const {
    getMovies,
    addMovie,
    updateMovie,
    deleteMovie,
    searchMovies,
    filterMovies
} = require('./movieManager');
const {fetchMovies} = require('./apiRequest');
const {writeFile} = require('./fileHandler');

const readline = require('readline');
const rl = readline.createInterface({input: process.stdin, output: process.stdout});

function displayMenu() {
    console.log('=== Movie Catalog Menu ===');
    console.log('1. Display Movie Catalog');
    console.log('2. Add New Movie');
    console.log('3. Update Movie Details');
    console.log('4. Delete Movie');
    console.log('5. Search and Filter');
    console.log('6. Fetch Movie Data');
    console.log('0. Exit');
}

function handleMenuSelection() {
    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1': displayMovieCatalog();
                break;
            case '2': promptAddMovie();
                break;
            case '3': promptUpdateMovie();
                break;
            case '4': promptDeleteMovie();
                break;
            case '5': handleSearchAndFilter();
                break;
            case '6': fetchMovieData();
                break;
            case '0':
                console.log('Exiting the application...');
                rl.close();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                handleMenuSelection();
        }
    });
}

function displayMovieCatalog() {
    getMovies().then((movies) => {
        console.log('=== Movie Catalog ===');
        movies.forEach((movie) => {
            console.log(`Title: ${
                movie.title
            }`);
            console.log(`Director: ${
                movie.director
            }`);
            console.log(`Release Year: ${
                movie.releaseYear
            }`);
            console.log(`Genre: ${
                movie.genre
            }`);
            console.log('---------------------------');
        });
        handleMenuSelection();
    }).catch((error) => {
        console.log('Error:', error.message);
        handleMenuSelection();
    });
}

function promptAddMovie() {
    rl.question('Enter the title of the movie: ', (title) => {
        rl.question('Enter the director of the movie: ', (director) => {
            rl.question('Enter the release year of the movie: ', (releaseYear) => {
                rl.question('Enter the genre of the movie: ', (genre) => {
                    addMovie(title, director, releaseYear, genre).then(() => {
                        console.log('Movie added successfully!');
                        handleMenuSelection();
                    }).catch((error) => {
                        console.log('Error:', error.message);
                        handleMenuSelection();
                    });
                });
            });
        });
    });
}

function promptUpdateMovie() {
    getMovies().then((movies) => {
        console.log('=== Movie Catalog ===');
        movies.forEach((movie, index) => {
            console.log(`${
                index + 1
            }. ${
                movie.title
            }`);
        });

        rl.question('Select the number of the movie to update: ', (choice) => {
            const movieIndex = parseInt(choice) - 1;
            if (isNaN(movieIndex) || movieIndex < 0 || movieIndex >= movies.length) {
                console.log('Invalid movie selection. Please try again.');
                handleMenuSelection();
            } else {
                const selectedMovie = movies[movieIndex];
                promptUpdatedMovieDetails(selectedMovie);
            }
        });
    }).catch((error) => {
        console.log('Error:', error.message);
        handleMenuSelection();
    });
}

function promptUpdatedMovieDetails(movie) {
    rl.question('Enter the updated title of the movie: ', (title) => {
        rl.question('Enter the updated director of the movie: ', (director) => {
            rl.question('Enter the updated release year of the movie: ', (releaseYear) => {
                rl.question('Enter the updated genre of the movie: ', (genre) => {
                    const updatedMovie = {
                        title: title || movie.title,
                        director: director || movie.director,
                        releaseYear: releaseYear || movie.releaseYear,
                        genre: genre || movie.genre
                    };
                    updateMovie(movie, updatedMovie).then(() => {
                        console.log('Movie updated successfully!');
                        handleMenuSelection();
                    }).catch((error) => {
                        console.log('Error:', error.message);
                        handleMenuSelection();
                    });
                });
            });
        });
    });
}

function promptDeleteMovie() {
    getMovies().then((movies) => {
        console.log('=== Movie Catalog ===');
        movies.forEach((movie, index) => {
            console.log(`${
                index + 1
            }. ${
                movie.title
            }`);
        });

        rl.question('Select the number of the movie to delete: ', (choice) => {
            const movieIndex = parseInt(choice) - 1;
            if (isNaN(movieIndex) || movieIndex < 0 || movieIndex >= movies.length) {
                console.log('Invalid movie selection. Please try again.');
                handleMenuSelection();
            } else {
                deleteMovie(movieIndex).then(() => {
                    console.log('Movie deleted successfully!');
                    handleMenuSelection();
                }).catch((error) => {
                    console.log('Error:', error.message);
                    handleMenuSelection();
                });
            }
        });
    }).catch((error) => {
        console.log('Error:', error.message);
        handleMenuSelection();
    });
}

function handleSearchAndFilter() {
    console.log('=== Search and Filter ===');
    console.log('1. Search Movies');
    console.log('2. Filter Movies');
    console.log('0. Go Back');

    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1': promptSearchMovies();
                break;
            case '2': promptFilterMovies();
                break;
            case '0': handleMenuSelection();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                handleSearchAndFilter();
        }
    });
}

function promptSearchMovies() {
    rl.question('Enter the search query: ', (query) => {
        searchMovies(query).then((searchResults) => {
            if (searchResults.length === 0) {
                console.log('No movies found matching the search query.');
            } else {
                console.log('=== Search Results ===');
                searchResults.forEach((movie) => {
                    console.log(`Title: ${
                        movie.title
                    }`);
                    console.log(`Director: ${
                        movie.director
                    }`);
                    console.log(`Release Year: ${
                        movie.releaseYear
                    }`);
                    console.log(`Genre: ${
                        movie.genre
                    }`);
                    console.log('---------------------------');
                });
            } handleSearchAndFilter();
        }).catch((error) => {
            console.log('Error:', error.message);
            handleSearchAndFilter();
        });
    });
}

function promptFilterMovies() {
    console.log('=== Filter Options ===');
    console.log('1. Filter by Genre');
    console.log('2. Filter by Release Year');
    console.log('0. Go Back');

    rl.question('Enter your choice: ', (choice) => {
        switch (choice) {
            case '1': rl.question('Enter the genre to filter by: ', (genre) => {
                    filterMovies({genre}).then((filteredMovies) => {
                        if (filteredMovies.length === 0) {
                            console.log('No movies found matching the filter criteria.');
                        } else {
                            console.log('=== Filtered Results ===');
                            filteredMovies.forEach((movie) => {
                                console.log(`Title: ${
                                    movie.title
                                }`);
                                console.log(`Director: ${
                                    movie.director
                                }`);
                                console.log(`Release Year: ${
                                    movie.releaseYear
                                }`);
                                console.log(`Genre: ${
                                    movie.genre
                                }`);
                                console.log('---------------------------');
                            });
                        } handleSearchAndFilter();
                    }).catch((error) => {
                        console.log('Error:', error.message);
                        handleSearchAndFilter();
                    });
                });
                break;
            case '2': rl.question('Enter the release year to filter by: ', (releaseYear) => {
                    filterMovies({releaseYear}).then((filteredMovies) => {
                        if (filteredMovies.length === 0) {
                            console.log('No movies found matching the filter criteria.');
                        } else {
                            console.log('=== Filtered Results ===');
                            filteredMovies.forEach((movie) => {
                                console.log(`Title: ${
                                    movie.title
                                }`);
                                console.log(`Director: ${
                                    movie.director
                                }`);
                                console.log(`Release Year: ${
                                    movie.releaseYear
                                }`);
                                console.log(`Genre: ${
                                    movie.genre
                                }`);
                                console.log('---------------------------');
                            });
                        } handleSearchAndFilter();
                    }).catch((error) => {
                        console.log('Error:', error.message);
                        handleSearchAndFilter();
                    });
                });
                break;
            case '0': handleSearchAndFilter();
                break;
            default:
                console.log('Invalid choice. Please try again.');
                handleSearchAndFilter();
        }
    });
}

function fetchMovieData() {
    rl.question('Enter the movie title to fetch data: ', (title) => {
        fetchMovies(title).then((movieData) => {
            console.log('=== Fetched Movie Data ===');
            console.log(`Title: ${
                movieData.title
            }`);
            console.log(`Director: ${
                movieData.director
            }`);
            console.log(`Release Year: ${
                movieData.releaseYear
            }`);
            console.log(`Genre: ${
                movieData.genre
            }`);
            console.log('---------------------------');
            return getMovies();
        }).then((movies) => {
            console.log('Updating the local movie catalog...');
            return writeFile(movies);
        }).then(() => {
            console.log('Movie data fetched and updated successfully!');
            handleMenuSelection();
        }).catch((error) => {
            console.log('Error:', error.message);
            handleMenuSelection();
        });
    });
}

module.exports = {
    displayMenu,
    handleMenuSelection
};
