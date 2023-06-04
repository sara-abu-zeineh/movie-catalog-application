const fs = require('fs');

const MOVIES_FILE = 'movies.json';

function readFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(MOVIES_FILE, 'utf8', (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') { 
                    resolve([]);
                } else {
                    reject(err);
                }
            } else {
                try {
                    const movies = JSON.parse(data);
                    resolve(movies);
                } catch (parseError) {
                    reject(parseError);
                }
            }
        });
    });
}

function writeFile(movies) {
    return new Promise((resolve, reject) => {
        fs.writeFile(MOVIES_FILE, JSON.stringify(movies, null, 2), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = {
    readFile,
    writeFile
};
