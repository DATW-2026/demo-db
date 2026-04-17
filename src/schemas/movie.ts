import type { Genre } from './genre.ts';

export interface Movie {
    id: number;
    title: string;
    year: number;
    director: string;
    duration: number;
    poster: string;
    rate: number;
    genres?: Genre[];
}
export interface RelationMovieGenre {
    movie_id: number;
    genre_id: number;
}
