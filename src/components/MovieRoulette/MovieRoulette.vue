<template>
  <div class="movie-roulette-page">
    <NavBar />
    
    <div class="roulette-container">
      <!-- Title -->
      <div class="neon-text">Movie Roulette</div>
     
      <!-- Selected Movie Display -->
      <div class="selected-movie">
        {{ selectedMovie || 'Spin to select a movie' }}
      </div>

      <!-- Movies Display with Clean Selection -->
      <div class="movies-display">
        <div 
          v-for="(movie, index) in visibleMovies" 
          :key="index"
          class="movie-item"
          :class="{
            'movie-item-alt': index % 2 === 0,
            'movie-item-selected': index === 3,
          }"
        >
          {{ movie }}
        </div>
      </div>

      <!-- Spin Button -->
      <button 
        class="spin-button"
        :class="{ 'active': !isSpinning }"
        :disabled="isSpinning"
        @click="spinRoulette"
      >
        <div class="button-glow"></div>
        <div class="light-beam"></div>
        <span class="button-text">SPIN THE WHEEL</span>
      </button>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/ui/NavBar.vue'

export default {
  name: 'MovieRoulette',
  components: {
    NavBar
  },
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
      ],
      spinSpeed: 8,
      selectedMovie: "",
      isSpinning: false,
      visibleMovies: []
    }
  },
  created() {
    // Initialize visible movies
    this.resetVisibleMovies()
  },
  methods: {
    resetVisibleMovies() {
      this.visibleMovies = this.movies.slice(0, 7)
    },
    async spinRoulette() {
      if (this.isSpinning) return
      this.isSpinning = true
      
      // Calculate duration based on spin speed
      const baseDuration = 4000 / (this.spinSpeed / 8)
      const minSpins = 20 // Minimum number of movie changes
      const totalSpins = minSpins + Math.floor(Math.random() * 10)
      
      // Select the final movie
      const finalMovie = this.movies[Math.floor(Math.random() * this.movies.length)]
      
      // Animation variables
      let spinsCompleted = 0
      const spinInterval = baseDuration / totalSpins
      
      // Create spinning effect
      const spin = async () => {
        return new Promise(resolve => {
          const interval = setInterval(() => {
            // Rotate the visible movies
            this.visibleMovies = [
              ...this.movies.slice(-3),
              ...this.movies.slice(0, 4)
            ].sort(() => Math.random() - 0.5)
            
            spinsCompleted++
            
            if (spinsCompleted >= totalSpins) {
              clearInterval(interval)
              resolve()
            }
          }, spinInterval)
        })
      }

      // Execute the spin
      await spin()
      
      // Show final result
      this.selectedMovie = finalMovie
      this.visibleMovies = [
        ...this.movies.slice(this.movies.indexOf(finalMovie) - 3),
        finalMovie,
        ...this.movies.slice(this.movies.indexOf(finalMovie) + 1, this.movies.indexOf(finalMovie) + 3)
      ].slice(0, 7)
      
      this.isSpinning = false
    }
  }
}
</script>

<style scoped>
.movie-roulette-page {
  height: 100vh;
  padding-top: 70px; /* Reduced from 90px */
  background: #0a0a1f;
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.roulette-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem; /* Reduced from 2rem */
  text-align: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 70px); /* Subtract the padding-top */
  justify-content: space-between;
}

.neon-text {
  font-size: 2.5rem;
  color: #DB3DCF;
  text-shadow: 
    0 0 5px #DB3DCF,
    0 0 10px #DB3DCF,
    0 0 20px #DB3DCF;
  animation: neonFlicker 2s infinite;
}

.selected-movie {
  font-size: 2rem;
  padding: 1rem;
  margin: 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-top: 1px solid #675FF2;
  border-bottom: 1px solid #DB3DCF;
}

.movies-display {
  position: relative;
  max-width: 600px;
  margin: 0.5rem auto;
  padding: 1rem 0;
  background: rgba(10, 10, 31, 0.95);
  border-radius: 8px;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.movie-item {
  padding: 0.8rem;
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
  font-size: 1.2rem;
  font-weight: bold;
  padding: 1rem;
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
  margin: 1rem 0;
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

.spin-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  .roulette-container {
    padding: 0.5rem;
  }

  .neon-text{
    font-size: 1.8rem;
  }
  
  .selected-movie {
    font-size: 1.6rem;
    padding: 0.8rem;
  }

  .movie-item {
    font-size: 0.9rem;
    padding: 0.8rem;
  }

  .movie-item-selected {
    font-size: 1rem;
    padding: 1rem;
  }

  .spin-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
}
</style>