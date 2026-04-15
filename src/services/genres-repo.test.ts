import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { GenresRepo } from './genres-repo.ts';
import { connectDB } from '../config/db.ts';
import type { SqlError } from '../errors/sql-error.ts';

describe('GenresRepo', async () => {
    const pool = await connectDB();
    const genresRepo = new GenresRepo(pool);

    beforeEach(async () => {
        await pool.query(`DROP TABLE IF EXISTS genres`);
        await pool.query(`
            CREATE TABLE genres (
                genre_id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                created_at TIMESTAMP DEFAULT NOW()
            )
        `);
        await pool.query(`
            INSERT INTO genres (name) VALUES
                ('Action'),
                ('Adventure')
        `);
    });

    afterEach(async () => {
        await pool.query(`DROP TABLE IF EXISTS genres`);
    });

    describe('Read operations', () => {
        it('Should real all genres', async () => {
            const genres = await genresRepo.readAllGenres();
            assert(Array.isArray(genres));
            assert.strictEqual(genres.length, 2);
        });

        it('Should real a genre by id', async () => {
            const genre = await genresRepo.readGenreById(1);
            assert(genre);
            assert.strictEqual(genre.id, 1);
            assert.strictEqual(genre.name, 'Action');
        });

        it('Should throw error if genre not found', async () => {
            try {
                await genresRepo.readGenreById(10);
                assert.fail('Expected an error to be thrown');
            } catch (error) {
                assert.strictEqual(error, error as Error);
            }
        });
    });

    describe('Write operations', () => {
        it('Should create a new genre', async () => {
            const newGenre = await genresRepo.createGenre('Comedy');
            assert(newGenre);
            assert.strictEqual(newGenre.id, 3);
            assert.strictEqual(newGenre.name, 'Comedy');
        });

        it('Should update an existing genre', async () => {
            const updateGenre = await genresRepo.updateGenre(1, 'Patata');
            assert(updateGenre);
            assert.strictEqual(updateGenre.id, 1);
            assert.strictEqual(updateGenre.name, 'Patata');
        });
        it('Should throw an error if genre not found', async () => {
            try {
                const updateGenre = await genresRepo.updateGenre(3, 'Patata');
                assert(updateGenre);
            } catch (error) {
                assert.strictEqual((error as SqlError).code, 'NOT_FOUND');
                assert.strictEqual(
                    (error as SqlError).sqlState,
                    'UPDATE_FAILED',
                );
            }
        });
    });

    describe('Delete operations', () => {
        it('Should delete an existing genre', async () => {
            const deletedGenre = await genresRepo.deleteGenre(1);
            assert(deletedGenre);
            assert.strictEqual(deletedGenre.id, 1);
            assert.strictEqual(deletedGenre.name, 'Action');
        });
    });
});
