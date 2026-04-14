import debug from 'debug';

import { env } from './config/env.ts';
import { connectDB } from './config/db.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');

const pool = await connectDB();
const { rows } = await pool.query('SELECT * FROM genres;');
log(rows);
