import debug from 'debug';
import type { Pool } from 'pg';

import { env } from '../config/env.ts';
import type { Movie } from '../schemas/movie.ts';
import { SqlError } from '../errors/sql-error.ts';

const log = debug(`${env.PROJECT_NAME}:movies-repo`);
log('Starting application');

type MovieWithInfo = Movie & { info_genres: string[] };
export class MoviesRepo {
    #pool: Pool;

    constructor(pool: Pool) {
        this.#pool = pool;
    }

    #obtainGenre(movie: MovieWithInfo): Movie {
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
                release_year as year,
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
                    mo.release_year as year,
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
                order by mo.movie_id;
        `;

        const { rows } = await this.#pool.query<MovieWithInfo>(q);
        const result = rows.map(this.#obtainGenre);

        return result as Movie[];
    }

    async readMovieWithGenreById(id: number) {
        const q = `
            SELECT
                    mo.movie_id as id,
                    mo.title,
                    ARRAY_AGG(ge.genre_id || '#' || ge.name) as info_genres,
                    mo.release_year as year,
                    mo.director,
                    mo.duration,
                    mo.poster,
                    mo.rate
                FROM movies mo
                JOIN movies_genres mg
                    ON mo.movie_id = mg.movie_id
                JOIN genres ge
                    ON mg.genre_id = ge.genre_id
                    WHERE mo.movie_id = $1
                GROUP BY mo.movie_id
        `;

        const { rows } = await this.#pool.query<MovieWithInfo>(q, [id]);

        if (rows.length === 0) {
            throw new SqlError(`Genre with id ${id} not found`, {
                code: 'NOT_FOUND',
                sqlState: 'SELECT_FAILED',
                sqlMessage: `No movie found with id ${id}`,
            });
        }

        const result = rows.map(this.#obtainGenre);

        return result[0] as Movie;
    }

    async findMoviesWithGenresByTitle(title: string) {
        const q = `
        select mo.movie_id AS id, 
            mo.title,
            ARRAY_AGG(ge.genre_id || '#' || ge.name) as info_genres,
            mo.release_year as year, 
            mo.director, 
            mo.duration, 
            mo.poster, 
            mo.rate
        from movies mo
        join movies_genres mg
        on mo.movie_id = mg.movie_id
        join genres ge
        on ge.genre_id = mg.genre_id
        where mo.title ilike $1
        group by mo.movie_id
        order by mo.movie_id
        `;

        const { rows } = await this.#pool.query<MovieWithInfo>(q, [
            `%${title}%`,
        ]);
        const result = rows.map(this.#obtainGenre);
        return result as Movie[];
    }

    async createMovie(movie: Omit<Movie, 'id'>) {
        const q = `
            INSERT INTO movies (title, release_year, director, duration, poster, rate)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING movie_id AS id, title, release_year AS year, director, duration, poster, rate
        `;

        const { rows } = await this.#pool.query<Movie>(q, [
            movie.title,
            movie.year,
            movie.director,
            movie.duration,
            movie.poster,
            movie.rate,
        ]);

        const createdMovie = rows[0] as Movie;

        movie.genres?.forEach(async (genre) => {
            const q2 = `
                INSERT INTO movies_genres (movie_id, genre_id)
                VALUES ($1, $2)
            `;

            await this.#pool.query(q2, [createdMovie.id, genre.id]);
            createdMovie.genres?.push(genre);
        });

        return createdMovie;
    }
}
