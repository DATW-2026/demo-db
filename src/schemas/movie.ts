import type { Genre } from './genre.ts';

export interface Movie {
    id: number;
    title: string;
    releaseYear: number;
    director: string;
    duration: number;
    poster: string;
    rate: number;
    genres?: Genre[];
}
