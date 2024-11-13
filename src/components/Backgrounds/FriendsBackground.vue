<template>
  <div 
    class="fixed inset-0 pointer-events-auto bg-gradient-to-b from-gray-900 to-black"
    @mousemove="handleMouseMove"
    ref="container"
  >
    <!-- Base gradient overlay -->
    <div class="absolute inset-0 background-layer bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 animate-gradient-shift"></div>
    
    <!-- Meteors -->
    <div class="fixed inset-0 overflow-hidden">
      <div v-for="i in 15" :key="`meteor-${i}`" 
        class="meteor"
        :style="{
          '--delay': `${Math.random() * 20}s`,
          '--top': `${Math.random() * 100}%`,
          '--left': `${Math.random() * 100}%`,
          '--opacity': Math.random() * 0.8 + 0.2,
          '--duration': `${10 + Math.random() * 5}s`
        }"
      >
        <div class="meteor-tail"></div>
      </div>
    </div>

    <!-- Cursor follower -->
    <div 
      class="cursor-follower"
      :style="{
        left: `${cursorX}px`,
        top: `${cursorY}px`
      }"
    ></div>

    <!-- Interactive particles -->
    <div class="fixed inset-0">
      <div v-for="(particle, index) in particles" 
        :key="`particle-${index}`"
        class="interactive-particle"
        :style="{
          '--x': `${particle.x}px`,
          '--y': `${particle.y}px`,
          '--size': `${particle.size}px`,
          '--speed': `${particle.speed}s`,
        }"
      ></div>
    </div>

    <!-- Ripple effect -->
    <div class="fixed inset-0">
      <div v-for="(ripple, index) in ripples" 
        :key="`ripple-${index}`"
        class="ripple"
        :style="{
          left: `${ripple.x}px`,
          top: `${ripple.y}px`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const mousePosition = ref({ x: 0, y: 0 })
const cursorX = ref(0)
const cursorY = ref(0)

const cursorTrail = ref([])
const ripples = ref([])
const requestRef = ref(null)

// Define updateCursorTrail using a function declaration
const updateCursorTrail = () => {
  const newPoint = { x: mousePosition.value.x, y: mousePosition.value.y, id: Date.now() }
  cursorTrail.value = [newPoint, ...cursorTrail.value.slice(0, 9)]
  
  // Clean up old trail points after animation
  setTimeout(() => {
    cursorTrail.value = cursorTrail.value.filter(point => Date.now() - point.id < 500)
  }, 500)

  const newRipple = { x: mousePosition.value.x, y: mousePosition.value.y, id: Date.now() }
  ripples.value = [...ripples.value, newRipple]

  requestRef.value = requestAnimationFrame(updateCursorTrail)
}

const handleMouseMove = (event) => {
  mousePosition.value = { x: event.clientX, y: event.clientY }
  cursorX.value = event.clientX
  cursorY.value = event.clientY

  
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
  requestRef.value = requestAnimationFrame(updateCursorTrail)

  const rippleInterval = setInterval(() => {
    ripples.value = ripples.value.slice(1)
  }, 100)

  onUnmounted(() => {
    window.removeEventListener('mousemove', handleMouseMove)
    if (requestRef.value) {
      cancelAnimationFrame(requestRef.value)
    }
    clearInterval(rippleInterval)
  })
})
</script>

<style scoped>
.meteor {
  position: absolute;
  width: 1px;
  height: 1px;
  background: white;
  border-radius: 50%;
  top: var(--top);
  left: var(--left);
  opacity: var(--opacity);
  animation: meteor var(--duration) linear infinite;
  animation-delay: var(--delay);
  transform: rotate(-45deg);
}

.meteor-tail {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 100px;
  height: 1px;
  background: linear-gradient(
    90deg, 
    rgba(255,255,255,1) 0%, 
    rgba(255,255,255,0.8) 20%, 
    rgba(255,255,255,0) 100%
  );
  filter: blur(1px);
}

@keyframes meteor {
  0% {
    transform: translate(0, 0) rotate(-45deg) scale(1);
    opacity: var(--opacity);
  }
  100% {
    transform: translate(-100vw, 100vh) rotate(-45deg) scale(0.2);
    opacity: 0;
  }
}

/* Your existing styles for cursor-follower, interactive-particle, and ripple */
.cursor-follower {
  position: fixed;
  width: 200px;
  height: 200px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(147, 51, 234, 0.2) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  border-radius: 50%;
  filter: blur(20px);
  z-index: 1;
}

.interactive-particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: white;
  border-radius: 50%;
  opacity: 0.3;
  left: var(--x);
  top: var(--y);
  transition: all 0.3s ease;
}

.ripple {
  position: absolute;
  width: 2px;
  height: 2px;
  background: transparent;
  border: 2px solid rgba(147, 51, 234, 0.5);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: ripple 1s ease-out forwards;
}

@keyframes ripple {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 200px;
    height: 200px;
    opacity: 0;
  }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.animate-gradient-shift {
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
</style> 