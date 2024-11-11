const BASE_URL = 'https://api.themoviedb.org/3'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'
const TMDB_API_KEY = "1d349c13bf966a4e71a6e01cbb3bbe78"
class TMDBService {
    constructor() {
        if (!TMDB_API_KEY) {
          console.error('TMDB API key is not set in environment variables')
        }
    }

    getGenreMap() {
        return {
            action: 28,
            comedy: 35,
            drama: 18,
            adventure: 12,
            scifi: 878,
            fantasy: 14,
            thriller: 53,
            romance: 10749,
            crime: 80,
            animation: 16
        }
    }

     // Add method to get movies by multiple genres
     async getMoviesByGenres(genres = [], page = 1) {
        try {
            // Convert genre names to IDs using the method
            const genreIds = genres
                .map(genre => this.getGenreMap()[genre])
                .filter(id => id !== undefined)

            if (genreIds.length === 0) {
                return this.getPopularMovies(page)
            }

            const response = await fetch(
                `${BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreIds.join(',')}&page=${page}&sort_by=popularity.desc`
            )
            const data = await response.json()

            // Add console.log to see raw data
            console.log('Raw TMDB response:', data.results[0]);

            if (data.status_code === 7) {
                throw new Error('Invalid API key: You must be granted a valid key')
            }

            return data.results.map(movie => {
                // Add console.log for each movie's genre_ids
                console.log(`Movie ${movie.title} genre_ids:`, movie.genre_ids);
                
                return {
                    id: movie.id,
                    title: movie.title,
                    overview: movie.overview,
                    posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
                    backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
                    rating: movie.vote_average,
                    releaseDate: movie.release_date,
                    genre_ids: movie.genre_ids
                };
            });
        } catch (error) {
            console.error('Error fetching movies by genres:', error)
            throw error
        }
    }

    // In TMDBService.js
    async getPopularMovies(page = 1) {
        try {
        const response = await fetch(
            // Add language parameter and make sure adult content is filtered
            `${BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=${page}&include_adult=false`
        )
        const data = await response.json()
    
        console.log('Raw API Response:', data.results[0]) // Debug log to see raw data
    
        if (data.status_code === 7) {
            throw new Error('Invalid API key: You must be granted a valid key')
        }
        
        return data.results.map(movie => {
            console.log(`Genre IDs for ${movie.title}:`, movie.genre_ids) // Debug log
            return {
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterPath: movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : null,
            backdropPath: movie.backdrop_path ? `${IMAGE_BASE_URL}${movie.backdrop_path}` : null,
            rating: movie.vote_average,
            releaseDate: movie.release_date,
            genre_ids: movie.genre_ids // The TMDB API returns this as genre_ids
            }
        })
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
}

export default new TMDBService()
