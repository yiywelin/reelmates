<template>
    <div class="wheel-container">
      <h1 class="title">Movie Roulette</h1>
      <div class="result-display">{{ resultText }}</div>
  
      <div class="speed-control">
        <label>Spin Speed:</label>
        <input type="range" min="1" max="15" v-model="spinSpeed" class="speed-slider" />
        <span class="speed-value">{{ spinSpeed }}x</span>
      </div>
<<<<<<< Updated upstream
  
      <div class="wheel-section">
        <div class="selector"></div>
        <div class="indicator-line"></div>
        <div class="wheel">
          <div class="wheel__inner" ref="wheelInner">
            <div
              v-for="(movie, index) in movies"
              :key="index"
              class="wheel__segment"
              :style="getSegmentStyle(index)"
            >
              <span>{{ movie }}</span>
            </div>
=======

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
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
  
      <button class="spin-button" @click="spinWheel" :disabled="isSpinning">Spin the Wheel</button>
    </div>
<<<<<<< Updated upstream
  </template>
  
  <script>
  export default {
    data() {
      return {
        movies: [
          "The Godfather", "Pulp Fiction", "Inception", "Star Wars",
          "Jurassic Park", "The Matrix", "Titanic", "Avatar",
          "Fight Club", "Goodfellas", "Dark Knight", "Jaws",
          "E.T.", "Indiana Jones", "Back to Future", "Terminator",
          "Alien", "Blade Runner", "Die Hard", "The Shining",
          "Mad Max", "Top Gun", "Rocky", "Ghostbusters",
          "Predator", "The Thing", "RoboCop", "Scarface"
        ].reverse(),
        spinSpeed: 8,
        resultText: "Spin to select a movie",
        isSpinning: false,
        wheelAngle: 0,
        spinDuration: 4,
      };
    },
    methods: {
      getSegmentStyle(index) {
        const angle = 360 / this.movies.length;
        const rotateAngle = angle * index;
        return {
          transform: `rotateX(${rotateAngle}deg) translateZ(150px)`,
        };
      },
      spinWheel() {
        if (this.isSpinning) return;
  
        this.isSpinning = true;
        this.resultText = "Spinning...";
        let currentSpeed = this.spinSpeed * 2;
        const startTime = performance.now();
  
        const animate = (time) => {
          const elapsedTime = (time - startTime) / 1000;
  
          if (elapsedTime > this.spinDuration) {
            currentSpeed *= 0.97;
            if (currentSpeed < 0.1) {
              cancelAnimationFrame(this.animationId);
              this.selectMovie();
              return;
            }
=======

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
          <h2>{{ selectedMovie?.title }}</h2>
          <p class="movie-overview">{{ selectedMovie?.overview }}</p>
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
// import TMDBService from '../../services/tmdbService'

export default {
  name: 'MovieRoulette',
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
      showModal: false
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
          
          this.movies = likedMovies // Store complete movie objects
          
          if (this.movies.length > 0) {
            this.resetVisibleMovies()
          } else {
            this.error = "No liked movies found. Like some movies first!"
>>>>>>> Stashed changes
          }
  
          this.wheelAngle -= currentSpeed;
          this.$refs.wheelInner.style.transform = `rotateX(${this.wheelAngle}deg)`;
  
          this.animationId = requestAnimationFrame(animate);
        };
  
        this.animationId = requestAnimationFrame(animate);
      },
      selectMovie() {
        const anglePerSegment = 360 / this.movies.length;
        const normalizedAngle = (-this.wheelAngle % 360 + 360) % 360;
        const selectedIndex = Math.floor(normalizedAngle / anglePerSegment);
        this.resultText = this.movies[selectedIndex];
        this.isSpinning = false;
      },
    },
<<<<<<< Updated upstream
  };
  </script>
  
  <style scoped>
  *, *:before, *:after {
    box-sizing: border-box;
=======
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

      // Add automatic stop after 7 seconds
      setTimeout(() => {
        if (this.isSpinning) {
          this.stopRoulette()
        }
      }, 7000) // 7 seconds
    },
    async stopRoulette() {
      if (!this.isSpinning) return

      if (this.spinInterval) {
        clearInterval(this.spinInterval)
        this.spinInterval = null
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
        // Directly use the finalMovie data which already contains the poster path
        this.selectedMovie = finalMovie
        this.showModal = true
        
        // Update visible movies for the roulette display
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
      // Implement watch party functionality
      console.log('Starting watch party for:', this.selectedMovie.title)
    }
  },
  beforeUnmount() {
    if (this.spinInterval) {
      clearInterval(this.spinInterval)
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
}

.roulette-container {
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  height: calc(100% - 70px);
  gap: 0.5rem;
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
  min-height: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 0.25rem;
}

.movie-item {
  padding: clamp(0.4rem, 2vh, 0.8rem);
  font-size: clamp(0.8rem, 3vw, 1.1rem);
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
  font-size: clamp(0.9rem, 3.5vw, 1.2rem);
  padding: clamp(0.5rem, 2vh, 1rem);
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
  height: 150px;
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
  max-width: 500px; /* Reduced max-width for better poster display */
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
  position: relative; /* Added for overlay positioning */
  overflow: hidden;
  border-radius: 12px 12px 0 0;
  background: #0a0a1f;
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

.poster-overlay::-webkit-scrollbar {
  width: 4px;
}

.poster-overlay::-webkit-scrollbar-track {
  background: transparent;
}

.poster-overlay::-webkit-scrollbar-thumb {
  background: #675FF2;
  border-radius: 4px;
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
.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #0a0a1f;
  transition: transform 0.3s ease;
}

.no-poster {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D0CCE3;
}

.movie-details {
  padding: 1.5rem;
}

.movie-details h2 {
  margin: 0 0 0.5rem;
  color: #DB3DCF;
  font-size: 1.5rem;
  line-height: 1.2;
}

.movie-overview {
  color: #D0CCE3;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  max-height: 100px; /* Limit height of overview */
  overflow-y: auto;
  font-size: 0.9rem;
  padding-right: 0.5rem;
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

  .roulette-container {
    height: calc(100% - 60px);
    gap: 0.25rem;
  }

  .movies-display::before,
  .movies-display::after {
    height: 100px;
  }

  .neon-text {
    font-size: 1.8rem;
>>>>>>> Stashed changes
  }
  
  body {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #1a1c2c;
    margin: 0;
    font-family: 'Arial', sans-serif;
    color: white;
  }
  
  .wheel-container {
    position: relative;
    padding: 2rem;
    background: #2a2d3e;
    border-radius: 20px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  .result-display {
    background: #343850;
    padding: 1rem;
    margin-bottom: 2rem;
    border-radius: 10px;
    border: 2px solid #e50914;
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #fff;
    text-shadow: 0 0 10px rgba(229, 9, 20, 0.5);
  }
  
  .speed-control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .speed-slider {
    -webkit-appearance: none;
    width: 200px;
    height: 8px;
    border-radius: 4px;
    background: #1f2133;
    outline: none;
  }
  
  .speed-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #e50914;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .spin-button {
    background: #e50914;
    color: white;
    padding: 1rem 2rem;
    font-size: 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 2rem;
    text-transform: uppercase;
    letter-spacing: 2px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(229, 9, 20, 0.3);
  }
<<<<<<< Updated upstream
  
  .spin-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
=======

  .modal-content {
    width: 95%;
  }
  
  .movie-details h2 {
    font-size: 1.3rem;
  }
  
  .movie-overview {
    font-size: 0.9rem;
  }

  .movie-overview::-webkit-scrollbar {
  width: 4px;
  }

  .movie-overview::-webkit-scrollbar-track {
    background: #13132b;
  }

  .movie-overview::-webkit-scrollbar-thumb {
    background: #675FF2;
    border-radius: 4px;
  }
  
  .watch-party-button {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
}

@media (max-height: 600px) {
  .movie-roulette-page {
    padding-top: 50px;
>>>>>>> Stashed changes
  }
  
  .spin-button:disabled {
    background: #666;
    cursor: not-allowed;
  }
  
  .wheel-section {
    position: relative;
    margin: 2rem auto;
    width: fit-content;
  }
  
  .wheel {
    perspective: 1000px;
    position: relative;
  }
  
  .selector {
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 20px solid #e50914;
    filter: drop-shadow(0 0 5px rgba(229, 9, 20, 0.5));
    z-index: 1000;
  }
  
  .indicator-line {
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 2px;
    background: linear-gradient(90deg, rgba(229,9,20,1) 0%, rgba(229,9,20,0.7) 100%);
    transform: translateY(-50%);
    z-index: 999;
  }
<<<<<<< Updated upstream
  
  .wheel__inner {
    position: relative;
    width: 300px;
    height: 350px;
    transform-style: preserve-3d;
  }
  
  .wheel__segment {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    position: absolute;
    top: 50%;
    background: #1f2133;
    color: white;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }
  
  .wheel__segment:nth-child(even) {
    background: #272a40;
  }
  
  .title {
    font-size: 2rem;
    color: #e50914;
    margin-bottom: 2rem;
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 0 0 10px rgba(229, 9, 20, 0.3);
  }
  </style>
  
=======
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    max-height: 85vh;
  }
  
  .poster-container {
    height: 350px; /* Smaller height for mobile */
  }
  
  .movie-details h2 {
    font-size: 1.3rem;
  }
  
  .movie-overview {
    max-height: 80px; /* Smaller on mobile */
    font-size: 0.85rem;
  }
}

/* Add styles for very small screens */
@media (max-width: 380px) {
  .poster-container {
    height: 300px;
  }
  
  .movie-details {
    padding: 1rem;
  }
  
  .movie-overview {
    max-height: 70px;
  }
}

@media (max-width: 768px) {
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
  .poster-container {
    height: 300px;
  }
}

/* Update the no-poster placeholder */
.no-poster {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D0CCE3;
  font-size: 1rem;
  background: #0a0a1f;
}
</style>
>>>>>>> Stashed changes
