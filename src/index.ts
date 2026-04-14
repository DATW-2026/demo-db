import debug from 'debug';

import { env } from './config/env.ts';
import { connectDB } from './config/db.ts';
import type { Genre } from './schemas/genre.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');

const pool = await connectDB();
const id = 1;
const { rows } = await pool.query<Genre>(
    'SELECT genre_id as id, name FROM genres WHERE genre_id = $1',
    [id],
);
log(rows[0]);
