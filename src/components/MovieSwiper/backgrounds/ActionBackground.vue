<!-- ActionBackground.vue -->
<template>
  <div class="action-elements">
    <!-- Tech Grid with gold/amber colors -->
    <TechGrid 
      primaryColor="rgba(255, 215, 0, 0.15)"
      glowColor="rgba(255, 165, 0, 0.4)"
    />
    
    <!-- Dynamic light beams -->
    <div class="light-beams">
      <div 
        v-for="n in 8" 
        :key="`beam-${n}`" 
        class="beam"
        :style="getBeamStyle(n)"
      ></div>
    </div>

    <!-- Hexagonal particles -->
    <div class="particles">
      <div 
        v-for="n in 20" 
        :key="`particle-${n}`" 
        class="particle"
        :style="getParticleStyle()"
      ></div>
    </div>

    <!-- Energy pulses -->
    <div class="pulse-rings">
      <div 
        v-for="n in 3" 
        :key="`ring-${n}`" 
        class="pulse-ring"
        :style="{
          animationDelay: `${n * 1.5}s`
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import TechGrid from './TechGrid.vue'

const getBeamStyle = (index) => ({
  transform: `rotate(${index * 45}deg)`,
  animationDelay: `${index * 0.5}s`
})

const getParticleStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 4}s`,
  animationDuration: `${4 + Math.random() * 4}s`
})
</script>

<style scoped>
.action-elements {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #000000, #1a1a1a);
  overflow: hidden;
}

/* Light Beams */
.light-beams {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.beam {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 200%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent,
    rgba(255, 215, 0, 0.1),
    rgba(255, 215, 0, 0.2),
    rgba(255, 215, 0, 0.1),
    transparent
  );
  transform-origin: left center;
  animation: beamRotate 8s linear infinite;
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 215, 0, 0.2);
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  animation: particleFloat 6s ease-in-out infinite;
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
  width: 150px;
  height: 150px;
  border: 2px solid rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  animation: pulseExpand 4s ease-out infinite;
}

@keyframes beamRotate {
  from {
    transform: rotate(0deg) translateX(-50%);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  to {
    transform: rotate(360deg) translateX(-50%);
    opacity: 0;
  }
}

@keyframes particleFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    transform: translate(20px, -30px) rotate(180deg);
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
}

@keyframes pulseExpand {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

/* Add shine effect on particles hover */
.particle:hover {
  background: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
  transition: all 0.3s ease;
}
</style>