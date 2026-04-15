import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import { connectDB } from '../config/db.ts';
import type { SqlError } from '../errors/sql-error.ts';
import { prepareTestingDB } from '../config/prepare-testing-db.ts';
import { MoviesRepo } from './movies-repo.ts';

describe('MoviesRepo', async () => {
    const pool = await connectDB();
    const moviesRepo = new MoviesRepo(pool);

    beforeEach(async () => {
        await prepareTestingDB(pool);
    });

    afterEach(async () => {
        await pool.query(`DROP TABLE IF EXISTS genres`);
    });

    describe('Read Operations', () => {
        it();
    });
});
