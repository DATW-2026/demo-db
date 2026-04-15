import type { Pool } from 'pg';

export const prepareTestingDB = async (pool: Pool) => {
    await pool.query(`DROP TABLE IF EXISTS movies_genres`);
    await pool.query(`DROP TABLE IF EXISTS genres`);
    await pool.query(`DROP TABLE IF EXISTS movies`);

    await pool.query(`
            CREATE TABLE genres (
                genre_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
    await pool.query(`
            CREATE TABLE movies (
                movie_id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                release_year INT NOT NULL,
                director VARCHAR(255) NOT NULL,
                duration INT NOT NULL,
                poster TEXT,
                rate DECIMAL(2, 1) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
    await pool.query(`
            CREATE TABLE movies_genres (
                movie_id INT NOT NULL REFERENCES movies(movie_id) ON DELETE CASCADE,
                genre_id INT NOT NULL REFERENCES genres(genre_id) ON DELETE CASCADE,
                PRIMARY KEY (movie_id, genre_id)
            )    
        `);

    await pool.query(`
            INSERT INTO genres (name) VALUES
                ('Action'),
                ('Adventure')
        `);
    await pool.query(`
            INSERT INTO movies (title, release_year, director, duration, rate, poster) VALUES
                ('The Godfather', 1972, 'Francis Ford Coppola', 175, 9.2, 'https://www.imdb.com/title/tt0068646/'),
                ('The Dark Knight', 2008, 'Christopher Nolan', 152, 9.0, 'https://www.imdb.com/title/tt0468569/'),
                ('The Lord of the Rings: The Return of the King', 2003, 'Peter Jackson', 201, 8.9, 'https://www.imdb.com/title/tt0167260/')
        `);
    await pool.query(`
            INSERT INTO movies_genres (movie_id, genre_id) VALUES
                (1, 1),
                (2, 1),
                (2, 2),
                (3, 2)
        `);
};

export const cleanTestingDB = async (pool: Pool) => {
    await pool.query(`DROP TABLE IF EXISTS movies_genres`);
    await pool.query(`DROP TABLE IF EXISTS genres`);
    await pool.query(`DROP TABLE IF EXISTS movies`);
};
