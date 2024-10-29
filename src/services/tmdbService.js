const TMDB_API_KEY = process.env.VUE_APP_TMDB_API_KEY
const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

class TMDBService {
    constructor() {
        if (!TMDB_API_KEY) {
          console.error('TMDB API key is not set in environment variables')
        }
      }

    async getPopularMovies(page = 1) {
        try {
        const response = await fetch(
            `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
        )
        const data = await response.json()

        if (data.status_code === 7) {
            throw new Error('Invalid API key: You must be granted a valid key')
        }
        
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date,
            genreIds: movie.genre_ids
        }))
        } catch (error) {
        console.error('Error fetching popular movies:', error)
        throw error
        }
    }

    async getMovieDetails(movieId) {
        try {
        const response = await fetch(
            `${BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`
        )
        const movie = await response.json()
        
        return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date,
            genres: movie.genres,
            runtime: movie.runtime
        }
        } catch (error) {
        console.error('Error fetching movie details:', error)
        throw error
        }
    }

    async getMoviesByGenre(genreId, page = 1) {
        try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
        )
        const data = await response.json()
        
        return data.results.map(movie => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date,
            genreIds: movie.genre_ids
        }))
        } catch (error) {
        console.error('Error fetching movies by genre:', error)
        throw error
        }
    }
}

export default new TMDBService()