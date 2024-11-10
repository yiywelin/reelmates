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
      
      <!-- Speed Control -->
      <div class="speed-control">
        <div class="speed-label">SPIN SPEED:</div>
        <div class="speed-slider-wrapper">
          <input 
            type="range" 
            min="1" 
            max="15" 
            v-model="spinSpeed" 
            class="speed-slider"
          />
          <div class="speed-value">{{ spinSpeed }}x</div>
        </div>
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
  min-height: 100vh;
  padding-top: 90px;
  background: #0a0a1f;
  color: white;
}

.roulette-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 0.5rem;
  background: linear-gradient(to right, #675FF2, #DB3DCF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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

.title-line {
  width: 100px;
  height: 2px;
  margin: 0.5rem auto 2rem;
  background: linear-gradient(to right, #675FF2, #DB3DCF);
}

.selected-movie {
  font-size: 2.5rem;
  padding: 1.5rem;
  margin: 2rem 0;
  text-transform: uppercase;
  letter-spacing: 2px;
  border-top: 1px solid #675FF2;
  border-bottom: 1px solid #DB3DCF;
}

.speed-control {
  margin: 2rem 0;
}

.speed-label {
  font-size: 1.2rem;
  letter-spacing: 2px;
  margin-bottom: 1rem;
}

.speed-slider-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.speed-slider {
  flex: 1;
  max-width: 400px;
  -webkit-appearance: none;
  height: 4px;
  background: linear-gradient(to right, #675FF2, #DB3DCF);
  border-radius: 2px;
  outline: none;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #DB3DCF;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(219, 61, 207, 0.5);
}

.speed-value {
  background: rgba(10, 10, 31, 0.95);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: 1px solid rgba(219, 61, 207, 0.3);
  min-width: 60px;
  text-align: center;
}

.movies-display {
  position: relative;
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem 0;
  background: rgba(10, 10, 31, 0.95);
  border-radius: 8px;
  overflow: hidden;
}

.movie-item {
  padding: 1.2rem;
  font-size: 1.2rem;
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
  font-size: 1.4rem;
  font-weight: bold;
  padding: 1.5rem;
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
  padding: 1.5rem 4rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: none;
  border: 2px solid #675FF2;
  border-radius: 12px;
  color: #D0CCE3;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
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
    padding: 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .selected-movie {
    font-size: 1.8rem;
  }

  .movie-item {
    font-size: 1rem;
    padding: 1rem;
  }

  .movie-item-selected {
    font-size: 1.2rem;
    padding: 1.2rem;
  }

  .spin-button {
    padding: 1.2rem 3rem;
    font-size: 1.2rem;
  }
}
</style>