import debug from 'debug';
import type { Pool } from 'pg';

import { env } from '../config/env.ts';
import type { Movie } from '../schemas/movie.ts';
import { SqlError } from '../errors/sql-error.ts';
import { string } from 'zod';

const log = debug(`${env.PROJECT_NAME}:movies-repo`);
log('Starting application');

type MovieWithInfo = Movie & { info_genres: string[] };
export class MoviesRepo {
    #pool: Pool;

    constructor(pool: Pool) {
        this.#pool = pool;
    }

    #obtainGenere(movie: MovieWithInfo): Movie {
        if (movie.info_genres) {
            movie.genres = movie.info_genres.map((g) => {
                const [id, name] = g.split('#');
                return { id: Number(id), name: name as string };
            });
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { info_genres, ...rest } = movie as MovieWithInfo;

        return rest;
    }

    async readAllMovies() {
        const q = `
            SELECT
                movie_id as id,
                title,
                release_year as releaseYear,
                director,
                duration,
                poster,
                rate
            FROM movies;
        `;

        const { rows } = await this.#pool.query<Movie>(q);

        return rows;
    }
    async readAllMoviesWithGenres() {
        const q = `
            SELECT
                    mo.movie_id as id,
                    mo.title,
                    ARRAY_AGG(ge.genre_id || '#' || ge.name) as info_genres,
                    mo.release_year as releaseYear,
                    mo.director,
                    mo.duration,
                    mo.poster,
                    mo.rate
                FROM movies mo
                JOIN movies_genres mg
                    ON mo.movie_id = mg.movie_id
                JOIN genres ge
                    ON mg.genre_id = ge.genre_id
                GROUP BY mo.movie_id
        `;

        const { rows } = await this.#pool.query<MovieWithInfo>(q);

        const result = rows.map((movie: Movie) => {
            this.#obtainGenere(movie);
        });

        return result as Movie[];
    }
}
