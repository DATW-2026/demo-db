import debug from 'debug';
import type { Pool } from 'pg';

import { env } from '../config/env.ts';
import type { Genre } from '../schemas/genre.ts';
import { SqlError } from '../errors/sql-error.ts';

const log = debug(`${env.PROJECT_NAME}:index`);
log('Starting application');

export class GenresRepo {
    #pool: Pool;
    constructor(pool: Pool) {
        this.#pool = pool;
    }

    async readAllGenres() {
        const { rows } = await this.#pool.query<Genre>(
            'SELECT genre_id as id, name FROM genres;',
        );
        return rows;
    }

    async readGenreById(id: number) {
        const q = `
            SELECT genre_id as id, name
            FROM genres
            WHERE genre_id = $1`;

        const { rows } = await this.#pool.query<Genre>(q, [id]);

        if (rows.length === 0) {
            throw new SqlError(`Genre with id ${id} not found`, {
                code: 'NOT_FOUND',
                sqlMessage: `No genre found with id ${id}`,
            });
        }

        return rows[0];
    }
}
