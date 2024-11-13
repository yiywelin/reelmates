<template>
  <div class="movie-roulette-page">
    <NavBar />

    <div class="back-button-position z-[100]">
      <button 
        @click="router.back()"
        class="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
      >
        <!-- Outer glow ring - corrected to match your X button style -->
        <div class="absolute inset-0 rounded-full border border-[#DB3DCF] hover:border-[#DB3DCF] hover:shadow-[0_0_10px_#DB3DCF] transition-all duration-300"></div>
        
        <!-- Arrow icon -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-6 h-6 text-[#DB3DCF]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
    </div>
    
    <div class="roulette-container">
      <!-- Title -->
      <div class="neon-text">Movie Roulette</div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        Loading your movies...
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        {{ error }}
      </div>
     
      <!-- Content when movies are loaded -->
      <template v-else>
        <!-- Selected Movie Display -->
        <div class="selected-movie">
          {{ selectedMovie?.title || 'Spin to select a movie' }}
        </div>

        <!-- Movies Display -->
        <div v-if="movies.length > 0" class="movies-display">
          <div 
            v-for="(movie, index) in visibleMovies" 
            :key="index"
            class="movie-item"
            :class="{
              'movie-item-alt': index % 2 === 0,
              'movie-item-selected': index === 3,
            }"
          >
            {{ movie.title }}
          </div>
        </div>

        <!-- No Movies Message -->
        <div v-else class="no-movies-message">
          You haven't liked any movies yet. 
          Go back and like some movies to use the roulette!
        </div>

        <!-- Spin Button -->
        <button 
          class="spin-button"
          :class="{ 'active': !isSpinning }"
          :disabled="movies.length === 0"
          @click="handleRouletteButton"
        >
          <div class="button-glow"></div>
          <div class="light-beam"></div>
          <span class="button-text">
            {{ isSpinning ? 'STOP THE ROULETTE' : 'START THE ROULETTE' }}
          </span>
        </button>
      </template>
    </div>

    <!-- Movie Poster Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="closeModal">×</button>
        <div class="poster-container">
          <img 
            v-if="selectedMovie?.posterPath" 
            :src="selectedMovie.posterPath" 
            :alt="selectedMovie.title"
            class="movie-poster"
          />
          <div v-else class="no-poster">
            No poster available
          </div>
          <div class="poster-overlay">
            <div class="overlay-title">{{ selectedMovie?.title }}</div>
            <div class="overlay-description">{{ selectedMovie?.overview }}</div>
          </div>
        </div>
        <div class="movie-details">
          <button class="watch-party-button" @click="startWatchParty">
            Start Watch Party
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/ui/NavBar.vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { useRouter } from 'vue-router'

export default {
  name: 'MovieRoulette',
  setup() {
    const router = useRouter()
    return {
      router
    }
  },
  components: {
    NavBar
  },
  data() {
    return {
      movies: [],
      spinSpeed: 8,
      selectedMovie: null,
      isSpinning: false,
      visibleMovies: [],
      spinInterval: null,
      loading: true,
      error: null,
      showModal: false,
      autoStopTimeout: null,
    }
  },
  created() {
    console.log('Component created, fetching movies...')
    this.fetchLikedMovies()
  },
  methods: {
    async fetchLikedMovies() {
      const auth = getAuth()
      console.log('Current user:', auth.currentUser)
      if (!auth.currentUser) return

      try {
        this.loading = true
        this.error = null
        
        const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const likedMovies = userData.likedMovies || []
          console.log("Liked movies: " + likedMovies)
          
          this.movies = likedMovies
          
          if (this.movies.length > 0) {
            this.resetVisibleMovies()
          } else {
            this.error = "No liked movies found. Like some movies first!"
          }
        }
      } catch (err) {
        console.error('Error fetching liked movies:', err)
        this.error = "Failed to load your liked movies"
      } finally {
        this.loading = false
      }
    },
    resetVisibleMovies() {
      if (this.movies.length === 0) {
        this.visibleMovies = []
        return
      }
      
      if (this.movies.length < 7) {
        this.visibleMovies = [
          ...this.movies,
          ...this.movies,
          ...this.movies
        ].slice(0, 7)
      } else {
        this.visibleMovies = this.movies.slice(0, 7)
      }
    },
    handleRouletteButton() {
    if (this.isSpinning) {
      this.stopRoulette()
    } else {
      this.startRoulette()
      }
    },
    startRoulette() {
      if (this.isSpinning || this.movies.length === 0) return
      this.isSpinning = true
      
      const spinInterval = 100 / (this.spinSpeed / 8)
      
      this.spinInterval = setInterval(() => {
        this.visibleMovies = [
          ...this.movies.slice(-3),
          ...this.movies.slice(0, 4)
        ].sort(() => Math.random() - 0.5)
      }, spinInterval)

      // Store timeout ID so we can clear it if manual stop happens
      this.autoStopTimeout = setTimeout(() => {
        if (this.isSpinning) {
          this.stopRoulette()
        }
      }, 7000)
    },
    async stopRoulette() {
      if (!this.isSpinning) return

      if (this.spinInterval) {
        clearInterval(this.spinInterval)
        this.spinInterval = null
      }

      if (this.autoStopTimeout) {
        clearTimeout(this.autoStopTimeout)
        this.autoStopTimeout = null
      }
      
      const finalMovie = this.movies[Math.floor(Math.random() * this.movies.length)]
      
      const slowdownFrames = 10
      const slowdownInterval = 100
      
      for (let i = 0; i < slowdownFrames; i++) {
        await new Promise(resolve => setTimeout(resolve, slowdownInterval * (i + 1)))
        this.visibleMovies = [
          ...this.movies.slice(-3),
          ...this.movies.slice(0, 4)
        ].sort(() => Math.random() - 0.5)
      }
      
      try {
        this.selectedMovie = finalMovie
        this.showModal = true
        
        this.visibleMovies = [
          ...this.movies.slice(this.movies.indexOf(finalMovie) - 3),
          finalMovie,
          ...this.movies.slice(this.movies.indexOf(finalMovie) + 1, this.movies.indexOf(finalMovie) + 3)
        ].slice(0, 7)
        
      } catch (error) {
        console.error('Error setting selected movie:', error)
        this.selectedMovie = finalMovie
      }
      
      this.isSpinning = false
    },
    closeModal() {
      this.showModal = false
    },
    startWatchParty() {
      if (this.selectedMovie) {
      try {
        // Get current route params
        // const route = this.$route
        
        // Navigate to watch party page with required params
        this.router.push({
          path: `/watch-party`,
        })
      } catch (error) {
        console.error('Failed to navigate to watch party:', error)
      }
    }
    }
  },
  beforeUnmount() {
    if (this.spinInterval) {
      clearInterval(this.spinInterval)
    }
    if (this.autoStopTimeout) {
      clearTimeout(this.autoStopTimeout)
    }
  }
}
</script>

<style scoped>
.movie-roulette-page {
  height: 100vh;
  height: 100dvh;
  padding-top: 70px;
  background: #0a0a1f;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.roulette-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: calc(100% - 70px);
  gap: 0.5rem;
}

.back-button-position {
  position: fixed;
  top: 80px; /* Adjust this value based on your navbar height */
  left: 16px;
  z-index: 60; /* Keep it below the navbar z-index */
}

.loading-state,
.error-state,
.no-movies-message {
  font-size: 1.2rem;
  padding: 2rem;
  text-align: center;
  color: #D0CCE3;
}

.error-state {
  color: #ff6b6b;
}

.spin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #4a4a6a;
  box-shadow: none;
}

.neon-text {
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  margin-bottom: 0.5rem;
  color: #DB3DCF;
  text-shadow: 
    0 0 5px #DB3DCF,
    0 0 10px #DB3DCF,
    0 0 20px #DB3DCF;
  animation: neonFlicker 2s infinite;
}

.selected-movie {
  font-size: clamp(1.2rem, 4vw, 2rem);
  padding: 0.5rem;
  margin: 0;
  flex-shrink: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-top: 1px solid #675FF2;
  border-bottom: 1px solid #DB3DCF;
}

.movies-display {
  position: relative;
  max-width: 600px;
  margin: 0.5rem auto;
  padding: 0.5rem 0;
  flex: 1;
  min-height: min(400px, 50vh);
  max-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
  overflow-y: auto;
}

.movie-item {
  padding: min(0.8rem, 2vh);
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: #13132b;
  transition: all 0.3s ease;
  position: relative;
}

.movie-item-alt {
  background: #1a1a35;
}

.movie-item-selected {
  background: linear-gradient(90deg, 
    rgba(103, 95, 242, 0.3),
    rgba(219, 61, 207, 0.3)
  ) !important;
  font-weight: bold;
  padding: min(1rem, 2.5vh);
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
  transform: scale(1.02);
  z-index: 2;
  border-top: 1px solid rgba(103, 95, 242, 0.5);
  border-bottom: 1px solid rgba(219, 61, 207, 0.5);
  box-shadow: 
    0 0 20px rgba(103, 95, 242, 0.2),
    0 0 40px rgba(219, 61, 207, 0.2);
}

.movies-display::before,
.movies-display::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: min(150px, 20vh);
  z-index: 1;
  pointer-events: none;
}

.movies-display::before {
  top: 0;
  background: linear-gradient(to bottom, 
    rgba(10, 10, 31, 1) 0%,
    rgba(10, 10, 31, 0.9) 30%,
    rgba(10, 10, 31, 0) 100%
  );
}

.movies-display::after {
  bottom: 0;
  background: linear-gradient(to top, 
    rgba(10, 10, 31, 1) 0%,
    rgba(10, 10, 31, 0.9) 30%,
    rgba(10, 10, 31, 0) 100%
  );
}

.spin-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 3rem;
  font-size: 1.3rem;
  font-weight: bold;
  background: none;
  border: 2px solid #675FF2;
  border-radius: 12px;
  color: #D0CCE3;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  margin: 1rem auto;
  min-width: fit-content;
  max-width: max-content;
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, #675FF2, #DB3DCF);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.light-beam {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(103, 95, 242, 0.5),
    transparent
  );
  transform: translateX(-100%);
}

.spin-button:hover:not(:disabled) .light-beam {
  animation: beam 4s infinite;
}

.spin-button.active {
  border-color: #DB3DCF;
  box-shadow: 0 0 30px rgba(219, 61, 207, 0.5);
}

.spin-button:not(.active) {
  border-color: #675FF2;
  box-shadow: 0 0 30px rgba(103, 95, 242, 0.5);
}

.spin-button:not(.active) .button-glow {
  background: linear-gradient(45deg, #ff4444, #ff6b6b);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 31, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: #13132b;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #675FF2;
  box-shadow: 
    0 0 30px rgba(103, 95, 242, 0.3),
    0 0 60px rgba(219, 61, 207, 0.3);
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #D0CCE3;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 2;
}

.poster-container {
  width: 100%;
  height: 450px;
  position: relative;
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: #0a0a1f;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #0a0a1f;
  transition: transform 0.3s ease;
}

.poster-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 10, 31, 0.9);
  padding: 1.5rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow-y: auto;
  color: #D0CCE3;
}

.poster-container:hover .poster-overlay {
  opacity: 1;
}

.poster-container:hover .movie-poster {
  transform: scale(1.05);
}

.overlay-title {
  color: #DB3DCF;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.overlay-description {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.movie-details {
  padding: 1rem;
}

.watch-party-button {
  background: linear-gradient(45deg, #675FF2, #DB3DCF);
  border: none;
  border-radius: 8px;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.watch-party-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(219, 61, 207, 0.3);
}

.no-poster {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D0CCE3;
  font-size: 1rem;
  background: #0a0a1f;
}

/* Scrollbar styles for movies-display and poster-overlay */
.movies-display::-webkit-scrollbar,
.poster-overlay::-webkit-scrollbar {
  width: 4px;
}

.movies-display::-webkit-scrollbar-track,
.poster-overlay::-webkit-scrollbar-track {
  background: transparent;
}

.movies-display::-webkit-scrollbar-thumb,
.poster-overlay::-webkit-scrollbar-thumb {
  background: #675FF2;
  border-radius: 4px;
}

@keyframes beam {
  0% {
    transform: translateX(-100%);
  }
  50%, 100% {
    transform: translateX(100%);
  }
}

@media (max-width: 768px) {
  .movie-roulette-page {
    padding-top: 60px;
  }

  .back-button-position {
    top: 92px;
    left: 12px;
  }

  .roulette-container {
    height: calc(100% - 60px);
    gap: 0.25rem;
  }

  .movies-display {
    max-height: 60vh;
    min-height: min(300px, 45vh);
  }

  .movies-display::before,
  .movies-display::after {
    height: min(100px, 15vh);
  }

  .neon-text {
    font-size: 1.8rem;
    margin-top: 20px
  }
  
  .selected-movie {
    font-size: 1.6rem;
    padding: 0.8rem;
  }

  .movie-item {
    font-size: 0.9rem;
    padding: min(0.8rem, 2vh);
  }

  .movie-item-selected {
    font-size: 1rem;
    padding: min(1rem, 2.5vh);
  }

  .spin-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }

  .modal-content {
    width: 95%;
  }

  .poster-container {
    height: 350px;
  }

  .overlay-title {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .overlay-description {
    font-size: 0.85rem;
  }
}

@media (max-width: 380px) {
  .movie-roulette-page {
    padding-top: 50px;
  }

  .back-button-position {
    top: 82px;
    left: 10px;
  }

  .roulette-container {
    height: calc(100% - 50px);
    gap: 0.2rem;
  }

  .movies-display {
    max-height: 55vh;
    min-height: min(250px, 40vh);
    margin: 0.25rem auto;
  }

  .movies-display::before,
  .movies-display::after {
    height: min(60px, 12vh);
  }

  .neon-text {
    margin-bottom: 0.25rem;
  }

  .selected-movie {
    padding: 0.25rem;
  }

  .poster-container {
    height: 300px;
  }
}
</style>