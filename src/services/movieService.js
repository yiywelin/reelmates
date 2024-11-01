import { db } from '../firebaseConfig'
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'

class MovieService {
  constructor() {
    this.usersCollection = 'users'
  }

  /**
   * Record a movie swipe (like or dislike) for a user
   * @param {string} userId - The ID of the current user
   * @param {object} movie - The movie object being swiped
   * @param {boolean} isLike - True if the swipe is a like, false if it's a dislike
   */
  async recordMovieSwipe(userId, movie, isLike) {
    try {
      const userRef = doc(db, this.usersCollection, userId)
      
      // Update the appropriate arrays based on swipe direction
      if (isLike) {
        await updateDoc(userRef, {
          likedMovies: arrayUnion({
            movieId: movie.id,
            title: movie.title,
            posterPath: movie.poster_path,
            swipedAt: new Date().toISOString()
          })
        })
      } else {
        await updateDoc(userRef, {
          swipedMovies: arrayUnion({
            movieId: movie.id,
            title: movie.title,
            isLike: false,
            swipedAt: new Date().toISOString()
          })
        })
      }
    } catch (error) {
      console.error('Error recording movie swipe:', error)
      throw error
    }
  }

  /**
   * Remove a movie from user's liked movies
   * @param {string} userId - The ID of the current user
   * @param {object} movie - The movie object to be removed
   */
  async removeLikedMovie(userId, movie) {
    try {
      const userRef = doc(db, this.usersCollection, userId)
      await updateDoc(userRef, {
        likedMovies: arrayRemove({
          movieId: movie.id,
          title: movie.title,
          posterPath: movie.poster_path
        })
      })
    } catch (error) {
      console.error('Error removing liked movie:', error)
      throw error
    }
  }

  /**
   * Get all liked movies for a user
   * @param {string} userId - The ID of the current user
   * @returns {Array} Array of liked movies
   */
  async getLikedMovies(userId) {
    try {
      const userDoc = await getDoc(doc(db, this.usersCollection, userId))
      return userDoc.data()?.likedMovies || []
    } catch (error) {
      console.error('Error getting liked movies:', error)
      throw error
    }
  }
}

export default new MovieService()