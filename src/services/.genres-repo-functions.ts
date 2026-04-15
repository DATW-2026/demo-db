import debug from 'debug';
import type { Pool } from 'pg';

import { env } from '../config/env.ts';
import type { Genre } from '../schemas/genre.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');

export const readAllGenres = async (pool: Pool) => {
    const { rows } = await pool.query<Genre>(
        'SELECT genre_id as id, name FROM genres',
    );
    return rows;
};
