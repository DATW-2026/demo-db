import debug from 'debug';

import { env } from './config/env.ts';
import { connectDB } from './config/db.ts';
import { GenresRepo } from './services/genres-repo.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');

const pool = await connectDB();
const genresRepo = new GenresRepo(pool);

const g = await genresRepo.readAllGenres();
log('Genres:', g);

try {
    const g2 = await genresRepo.readGenreById(1);
    log(`Genres with id 1:`, g2);
} catch (error) {
    log((error as Error).message);
}
