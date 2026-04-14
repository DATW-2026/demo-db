import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import { GenresRepo } from './genres-repo.ts';
import { connectDB } from '../config/db.ts';

describe('GenresRepo', async () => {
    const pool = await connectDB();
    const genresRepo = new GenresRepo(pool);
    beforeEach(() => {
        //
    });

    it('Should real all genres', async () => {
        const genres = await genresRepo.readAllGenres();
        assert(Array.isArray(genres));
        assert.strictEqual(genres.length, 12);
    });

    it('Should real a genre by id', async () => {
        const genre = await genresRepo.readGenreById(1);
        assert(genre);
        assert.strictEqual(genre.id, 1);
    });

    it('Should throw error if genre not found', async () => {
        try {
            await genresRepo.readGenreById(999);
            assert.fail('Expected an error to be thrown');
        } catch (error) {
            assert.strictEqual(error, error as Error);
        }
    });
});
