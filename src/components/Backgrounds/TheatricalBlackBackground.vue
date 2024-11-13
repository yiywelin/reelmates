```vue
<template>
  <div class="modern-container">
    <!-- Subtle Gradient Background -->
    <div class="gradient-bg">
      <div class="gradient-layer primary"></div>
      <div class="gradient-layer secondary"></div>
    </div>

    <!-- Converging Lines -->
    <div class="lines-container">
      <!-- Center Lines -->
      <div class="lines-group center">
        <div v-for="n in 8" :key="`center-${n}`" 
             class="glowing-line"
             :style="getCenterLineStyle(n)">
          <div class="line-glow"></div>
        </div>
      </div>

      <!-- Left Diagonal Lines -->
      <div class="lines-group left">
        <div v-for="n in 8" :key="`left-${n}`" 
             class="glowing-line"
             :style="getLeftLineStyle(n)">
          <div class="line-glow"></div>
        </div>
      </div>

      <!-- Right Diagonal Lines -->
      <div class="lines-group right">
        <div v-for="n in 8" :key="`right-${n}`" 
             class="glowing-line"
             :style="getRightLineStyle(n)">
          <div class="line-glow"></div>
        </div>
      </div>
    </div>

    <!-- Ambient Overlay -->
    <div class="overlay"></div>
  </div>
</template>

<script setup>
const getCenterLineStyle = (index) => ({
  '--delay': `${index * -2}s`,
  '--opacity': 0.15 + (index * 0.02),
  '--position': `${-20 + (index * 5)}%`
})

const getLeftLineStyle = (index) => ({
  '--delay': `${index * -1.5}s`,
  '--opacity': 0.15 + (index * 0.02),
  '--position': `${10 + (index * 5)}%`,
  '--rotation': '-35deg'
})

const getRightLineStyle = (index) => ({
  '--delay': `${index * -1.5}s`,
  '--opacity': 0.15 + (index * 0.02),
  '--position': `${10 + (index * 5)}%`,
  '--rotation': '35deg'
})

const getShootingStarStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  transform: `rotate(${Math.random() * 180}deg)`,
  animationDelay: `${Math.random() * 15}s`,
  animationDuration: `${1 + Math.random() * 2}s`
});
</script>

<style scoped>
.modern-container {
  position: fixed;
  inset: 0;
  background: #070D0D;
  overflow: hidden;
  perspective: 1000px;
  z-index: 0;
}

/* Gradient Background */
.gradient-bg {
  position: absolute;
  inset: 0;
  opacity: 0.5;
}

.gradient-layer {
  position: absolute;
  inset: -50%;
  filter: blur(100px);
}

.primary {
  background: radial-gradient(
    circle at 30% 50%,
    rgba(103, 95, 242, 0.2),
    transparent 70%
  );
}

.secondary {
  background: radial-gradient(
    circle at 70% 50%,
    rgba(219, 61, 207, 0.15),
    transparent 70%
  );
}

/* Lines Container */
.lines-container {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  z-index: 0;
}

.lines-group {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}

.lines-group.center {
  transform: translateZ(0);
}

.lines-group.left {
  transform: rotate(var(--rotation)) translateZ(-100px);
}

.lines-group.right {
  transform: rotate(var(--rotation)) translateZ(-100px);
}

.glowing-line {
  position: absolute;
  top: var(--position);
  width: 100%;
  height: 2px; /* Increased from 1px */
  background: linear-gradient(
    90deg,
    transparent,
    rgba(103, 95, 242, var(--opacity)),
    rgba(219, 61, 207, var(--opacity)),
    rgba(103, 95, 242, var(--opacity)),
    transparent
  );
  transform-origin: center;
  animation: lineMove 8s var(--delay) infinite;
  box-shadow: 0 0 10px rgba(103, 95, 242, 0.5),
              0 0 20px rgba(219, 61, 207, 0.3);
}

.line-glow {
  position: absolute;
  inset: -2px;
  background: inherit;
  filter: blur(2px);
  opacity: 0.5;
}

/* Overlay */
.overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(10, 10, 31, 0.3) 100%
  );
  pointer-events: none;
}

@keyframes lineMove {
  0% {
    transform: translateX(-100%) scaleX(0.1);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateX(-50%) scaleX(0.5);
  }
  50% {
    transform: translateX(0%) scaleX(1);
    opacity: var(--opacity);
    filter: brightness(1.2);
  }
  90% {
    opacity: 1;
    transform: translateX(50%) scaleX(0.5);
  }
  100% {
    transform: translateX(100%) scaleX(0.1);
    opacity: 0;
  }
}

/* Enhanced glow effect for webkit browsers */
@supports (-webkit-backdrop-filter: none) {
  .glowing-line::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: inherit;
    filter: blur(4px);
    opacity: 0.7;
  }
}

/* Add smooth motion reduction for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glowing-line {
    animation: none;
  }
}

/* Increase star visibility */
.star {
  position: absolute;
  width: 2px;
  height: 2px;
  background: white;
  border-radius: 50%;
  animation: twinkle 3s infinite ease-in-out;
  opacity: 0.8; /* Increased base opacity */
}

/* Increase nebula visibility */
.nebula {
  position: absolute;
  inset: 0;
  opacity: 0.5; /* Increased from 0.3 */
  filter: blur(40px);
  transition: transform 0.1s ease-out;
}

.nebula-layer {
  position: absolute;
  inset: -50%;
  background-size: cover;
  opacity: 0.7; /* Increased from 0.5 */
  animation: nebulaFloat 120s infinite alternate;
}

/* Adjust shooting star animation */
.shooting-star {
  position: absolute;
  width: 150px; /* Increased from 100px */
  height: 2px;
  background: linear-gradient(to right, transparent, white, transparent);
  animation: shootingStar 2s ease-out infinite;
}

@keyframes shootingStar {
  0% {
    transform: translateX(-100%) translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateX(200%) translateY(0);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% { 
    opacity: 0.3; 
    transform: scale(1); 
  }
  50% { 
    opacity: 1; 
    transform: scale(1.3); 
  }
}
</style>```
