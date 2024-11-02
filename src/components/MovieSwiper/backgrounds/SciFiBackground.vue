<!-- SciFiBackground.vue -->
<template>
  <div class="sci-fi-background">
    <div class="stars">
      <div v-for="n in 50" :key="`star-${n}`" class="star" :style="getStarStyle()"></div>
    </div>
    
    <TechGrid />
    
    <div class="data-streams">
      <div 
        v-for="n in streamCount" 
        :key="`stream-${n}`" 
        class="data-stream"
        :style="getStreamStyle()"
      ></div>
    </div>

    <div class="floating-particles">
      <div 
        v-for="n in 20" 
        :key="`particle-${n}`" 
        class="particle"
        :style="getParticleStyle()"
      ></div>
    </div>

    <div class="pulse-rings">
      <div 
        v-for="n in 3" 
        :key="`ring-${n}`" 
        class="pulse-ring"
        :style="{animationDelay: `${n * 0.5}s`}"
      ></div>
    </div>

    <div class="hex-grid">
      <div 
        v-for="n in 12" 
        :key="`hex-${n}`" 
        class="hexagon"
        :style="getHexStyle(n)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import TechGrid from './TechGrid.vue'

const streamCount = ref(10)

const getStreamStyle = () => ({
  left: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 2}s`,
  height: `${20 + Math.random() * 30}px`,
  width: `${1 + Math.random() * 2}px`,
  opacity: 0.3 + Math.random() * 0.7
})

const getStarStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  width: `${1 + Math.random() * 2}px`,
  height: `${1 + Math.random() * 2}px`
})

const getParticleStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${5 + Math.random() * 5}s`
})

const getHexStyle = (index) => ({
  transform: `rotate(${index * 30}deg) translateY(-150px)`,
  animationDelay: `${index * 0.2}s`
})

let streamInterval

onMounted(() => {
  streamInterval = setInterval(() => {
    streamCount.value = Math.floor(5 + Math.random() * 10)
  }, 2000)
})

onUnmounted(() => {
  clearInterval(streamInterval)
})
</script>

<style scoped>
.sci-fi-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(45deg, #000428, #004e92);
  overflow: hidden;
}

/* Enhanced Data Streams */
.data-streams {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.data-stream {
  position: absolute;
  background: linear-gradient(to bottom, 
    transparent,
    rgba(77, 181, 255, 0.6),
    rgba(77, 181, 255, 0.8),
    rgba(77, 181, 255, 0.6),
    transparent
  );
  filter: blur(1px);
  animation: streamDown 2s linear infinite;
}

/* Stars */
.stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s ease-in-out infinite;
}

/* Floating Particles */
.floating-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(77, 181, 255, 0.6);
  border-radius: 50%;
  animation: float 5s ease-in-out infinite;
}

/* Pulse Rings */
.pulse-rings {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.pulse-ring {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(77, 181, 255, 0.3);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

/* Hexagon Grid */
.hex-grid {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

.hexagon {
  position: absolute;
  width: 60px;
  height: 34.64px;
  background: rgba(77, 181, 255, 0.1);
  border: 1px solid rgba(77, 181, 255, 0.3);
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
  animation: hexPulse 3s ease-in-out infinite;
}

@keyframes streamDown {
  from { 
    transform: translateY(-100%); 
    opacity: 0; 
  }
  50% { 
    opacity: 1; 
  }
  to { 
    transform: translateY(100vh); 
    opacity: 0; 
  }
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.2; 
    transform: scale(0.8); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.2); 
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  75% {
    transform: translateY(20px) translateX(-10px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(3);
    opacity: 0;
  }
}

@keyframes hexPulse {
  0%, 100% {
    opacity: 0.3;
    transform: rotate(var(--rotation)) translateY(-150px) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: rotate(var(--rotation)) translateY(-150px) scale(1.1);
  }
}
</style>