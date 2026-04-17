import debug from 'debug';

import { env } from './config/env.ts';
import { MoviesRepo } from './services/movies-repo.ts';
import { connectDB, connectSQLiteDB } from './config/db.ts';
import { GenresRepo } from './services/genres-repo.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');

const pool = await connectDB();
const genresRepo = new GenresRepo(pool);
const moviesRepo = new MoviesRepo(pool);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const g = await genresRepo.readAllGenres();
//log('Genres:', g);

try {
    const g2 = await genresRepo.readGenreById(1);
    log(`Genres with id 1:`, g2);
} catch (error) {
    log((error as Error).message);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const movies = await moviesRepo.readAllMoviesWithGenres();
//log(movies);

const sqliteDB = connectSQLiteDB();
try {
    sqliteDB.exec(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            handleName TEXT,
            password TEXT NOT NULL,
            firsName TEXT NOT NULL,
            lastName TEXT NOT NULL,
            avatar TEXT
        )
    `);
} catch (error) {
    log('Error creating SQLite tables:', error);
}
