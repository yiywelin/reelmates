<template>
    <div class="wheel-container">
      <h1 class="title">Movie Roulette</h1>
      <div class="result-display">{{ resultText }}</div>
  
      <div class="speed-control">
        <label>Spin Speed:</label>
        <input type="range" min="1" max="15" v-model="spinSpeed" class="speed-slider" />
        <span class="speed-value">{{ spinSpeed }}x</span>
      </div>
  
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
          </div>
        </div>
      </div>
  
      <button class="spin-button" @click="spinWheel" :disabled="isSpinning">Spin the Wheel</button>
    </div>
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
  };
  </script>
  
  <style scoped>
  *, *:before, *:after {
    box-sizing: border-box;
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
  
  .spin-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(229, 9, 20, 0.4);
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
  