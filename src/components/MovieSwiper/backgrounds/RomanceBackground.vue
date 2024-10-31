```vue
<template>
  <div class="romance-background">
    <!-- Floating Hearts -->
    <div class="hearts-container">
      <div v-for="n in 20" :key="`heart-${n}`" 
           class="floating-heart"
           :style="getHeartStyle(n)">
        ❤
      </div>
    </div>

    <!-- Gradient Orbs -->
    <div class="gradient-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Romantic Light Rays -->
    <div class="light-rays">
      <div v-for="n in 8" :key="`ray-${n}`"
           class="light-ray"
           :style="getRayStyle(n)">
      </div>
    </div>

    <!-- Sparkles -->
    <div class="sparkles">
      <div v-for="n in 30" :key="`sparkle-${n}`"
           class="sparkle"
           :style="getSparkleStyle(n)">
        ✦
      </div>
    </div>

    <!-- Soft Overlay -->
    <div class="romantic-overlay"></div>
  </div>
</template>

<script setup>
const getHeartStyle = (index) => {
  const delay = index * 0.7
  const duration = 15 + Math.random() * 10
  const size = 10 + Math.random() * 20
  
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`,
    left: `${Math.random() * 100}%`,
    opacity: 0.1 + Math.random() * 0.3
  }
}

const getRayStyle = (index) => {
  const rotation = (index * 45) % 360
  const delay = index * -2
  return {
    transform: `rotate(${rotation}deg)`,
    animationDelay: `${delay}s`
  }
}

const getSparkleStyle = (index) => {
  const delay = index * 0.3
  const duration = 3 + Math.random() * 2
  const size = 2 + Math.random() * 3
  
  return {
    '--delay': `${delay}s`,
    '--duration': `${duration}s`,
    '--size': `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`
  }
}
</script>

<style scoped>
.romance-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(
    135deg,
    #1a0f1f 0%,
    #2b1429 50%,
    #1f1a2b 100%
  );
  overflow: hidden;
}

/* Floating Hearts */
.hearts-container {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-heart {
  position: absolute;
  font-size: var(--size);
  color: #DB3DCF;
  animation: floatHeart var(--duration) linear infinite;
  animation-delay: var(--delay);
  opacity: 0;
  filter: blur(1px);
}

/* Gradient Orbs */
.gradient-orbs {
  position: absolute;
  inset: 0;
  filter: blur(80px);
}

.orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.5;
  animation: orbFloat 20s infinite ease-in-out;
}

.orb-1 {
  width: 50vh;
  height: 50vh;
  background: radial-gradient(circle at center, 
    rgba(219, 61, 207, 0.3),
    transparent 70%
  );
  top: -25vh;
  left: 20%;
}

.orb-2 {
  width: 45vh;
  height: 45vh;
  background: radial-gradient(circle at center, 
    rgba(103, 95, 242, 0.2),
    transparent 70%
  );
  bottom: -20vh;
  right: 20%;
  animation-delay: -7s;
}

.orb-3 {
  width: 40vh;
  height: 40vh;
  background: radial-gradient(circle at center, 
    rgba(255, 182, 193, 0.2),
    transparent 70%
  );
  top: 50%;
  left: 60%;
  animation-delay: -14s;
}

/* Light Rays */
.light-rays {
  position: absolute;
  inset: 0;
  opacity: 0.4;
}

.light-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 1px;
  background: linear-gradient(90deg,
    transparent,
    rgba(219, 61, 207, 0.2),
    transparent
  );
  transform-origin: left center;
  animation: rotateRay 10s linear infinite;
}

/* Sparkles */
.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  color: #FFB6C1;
  font-size: var(--size);
  animation: twinkle var(--duration) infinite ease-in-out;
  animation-delay: var(--delay);
}

/* Overlay */
.romantic-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    transparent 0%,
    rgba(26, 15, 31, 0.4) 100%
  );
  mix-blend-mode: overlay;
}

/* Animations */
@keyframes floatHeart {
  0% {
    transform: translateY(100vh) scale(1) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: var(--opacity);
  }
  90% {
    opacity: var(--opacity);
  }
  100% {
    transform: translateY(-20vh) scale(0.5) rotate(360deg);
    opacity: 0;
  }
}

@keyframes orbFloat {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-5%, -5%) scale(1.1);
  }
}

@keyframes rotateRay {
  from {
    transform: rotate(0deg) translateX(0) scaleX(1);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  45% {
    opacity: 1;
  }
  50% {
    transform: rotate(180deg) translateX(0) scaleX(1.5);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg) translateX(0) scaleX(1);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}
</style>
```