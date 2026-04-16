import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { connectDB } from '../config/db.ts';
import {
    cleanTestingDB,
    prepareTestingDB,
} from '../config/prepare-testing-db.ts';
import { MoviesRepo } from './movies-repo.ts';
//import { object } from 'zod';
import type { SqlError } from '../errors/sql-error.ts';

describe('MoviesRepo', async () => {
    const pool = await connectDB();
    const moviesRepo = new MoviesRepo(pool);

    beforeEach(async () => {
        await prepareTestingDB(pool);
    });

    afterEach(async () => {
        await cleanTestingDB(pool);
    });

    describe('Read Operations', () => {
        it('Should read all movies', async () => {
            const movies = await moviesRepo.readAllMovies();
            assert(Array.isArray(movies));
            assert.strictEqual(movies.length, 3);
            assert.strictEqual(movies[0]?.id, 1);
            assert.strictEqual(movies[0]?.title, 'The Godfather');
        });

        it('Should read all movies with genres', async () => {
            const movies = await moviesRepo.readAllMoviesWithGenres();
            assert(Array.isArray(movies));
            assert.strictEqual(movies.length, 3);
            const film2 = movies[1];
            assert(film2);
            assert(Array.isArray(film2.genres));
            assert.strictEqual(film2.genres?.length, 2);
            assert.deepEqual(film2.genres, [
                { id: 1, name: 'Action' },
                { id: 2, name: 'Adventure' },
            ]);
        });

        it('Should read a movie by id', async () => {
            const movie = await moviesRepo.readMovieWithGenreById(2);
            assert(movie);
            assert.strictEqual(movie.id, 2);
            assert.strictEqual(movie.title, 'The Dark Knight');
            assert(Array.isArray(movie.genres));
            assert.strictEqual(movie.genres?.length, 2);
            assert.deepEqual(movie.genres, [
                { id: 1, name: 'Action' },
                { id: 2, name: 'Adventure' },
            ]);
        });

        it('Should find movies with genres by title', async () => {
            const movies = await moviesRepo.findMoviesWithGenresByTitle('Dark');
            assert(Array.isArray(movies));
            assert.strictEqual(movies.length, 1);
            const film = movies[0];
            assert(film);
            assert.strictEqual(film.title, 'The Dark Knight');
            assert(Array.isArray(film.genres));
            assert.strictEqual(film.genres?.length, 2);
            assert.deepEqual(film.genres, [
                { id: 1, name: 'Action' },
                { id: 2, name: 'Adventure' },
            ]);
        });

        it('Should throw error if movie not found', async () => {
            try {
                await moviesRepo.readMovieWithGenreById(10);
                assert.fail('Expected an error to be thrown');
            } catch (error) {
                assert.strictEqual((error as SqlError).code, 'NOT_FOUND');
                assert.strictEqual(
                    (error as SqlError).sqlState,
                    'SELECT_FAILED',
                );
            }
        });

        it('Should return an empty array if no movies match the title', async () => {
            const movies =
                await moviesRepo.findMoviesWithGenresByTitle(
                    'Nonexistent Movie',
                );
            assert(Array.isArray(movies));
            assert.strictEqual(movies.length, 0);
        });
    });

    describe('Create Operations', () => {
        it('Should create a new movie', async () => {
            //
        });
    });
});
