<!-- RomanceBackground.vue -->
<template>
  <div class="romance-background">
    <TechGrid 
      primaryColor="rgba(255, 182, 193, 0.15)"
      glowColor="rgba(255, 105, 180, 0.4)"
    />
    
    <!-- Floating hearts -->
    <div class="floating-hearts">
      <div 
        v-for="n in 15" 
        :key="`heart-${n}`" 
        class="heart"
        :style="getHeartStyle()"
      ></div>
    </div>

    <!-- Glowing orbs -->
    <div class="glowing-orbs">
      <div 
        v-for="n in 8" 
        :key="`orb-${n}`" 
        class="orb"
        :style="getOrbStyle()"
      ></div>
    </div>

    <!-- Sparkles -->
    <div class="sparkles">
      <div 
        v-for="n in 20" 
        :key="`sparkle-${n}`" 
        class="sparkle"
        :style="getSparkleStyle()"
      ></div>
    </div>

    <!-- Flowing ribbons -->
    <div class="ribbons">
      <div 
        v-for="n in 6" 
        :key="`ribbon-${n}`" 
        class="ribbon"
        :style="getRibbonStyle(n)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import TechGrid from './TechGrid.vue'

const getHeartStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 5}s`,
  animationDuration: `${10 + Math.random() * 5}s`,
  transform: `scale(${0.5 + Math.random() * 0.5})`
})

const getOrbStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  transform: `scale(${0.8 + Math.random() * 0.4})`
})

const getSparkleStyle = () => ({
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  animationDelay: `${Math.random() * 3}s`,
  animationDuration: `${2 + Math.random() * 2}s`
})

const getRibbonStyle = (index) => ({
  left: `${(index / 6) * 100}%`,
  animationDelay: `${index * 0.5}s`,
  height: `${200 + Math.random() * 100}px`
})
</script>

<style scoped>
.romance-background {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #2d1f3d, #1f1f3d);
  overflow: hidden;
}

/* Floating Hearts */
.floating-hearts {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.heart {
  position: absolute;
  width: 20px;
  height: 20px;
  background: rgba(255, 182, 193, 0.3);
  clip-path: path('M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402m5.726-20.583c-2.203 0-4.446 1.042-5.726 3.238-1.285-2.206-3.522-3.248-5.719-3.248-3.183 0-6.281 2.187-6.281 6.191 0 4.661 5.571 9.429 12 15.809 6.43-6.38 12-11.148 12-15.809 0-4.011-3.095-6.181-6.274-6.181');
  animation: heartFloat 10s ease-in-out infinite;
  filter: drop-shadow(0 0 5px rgba(255, 182, 193, 0.5));
}

/* Glowing Orbs */
.glowing-orbs {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  width: 100px;
  height: 100px;
  background: radial-gradient(
    circle at center,
    rgba(255, 192, 203, 0.2) 0%,
    rgba(255, 182, 193, 0.1) 50%,
    transparent 70%
  );
  border-radius: 50%;
  animation: orbGlow 4s ease-in-out infinite;
}

/* Sparkles */
.sparkles {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.sparkle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  animation: sparkleTwinkle 3s ease-in-out infinite;
}

/* Flowing Ribbons */
.ribbons {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.ribbon {
  position: absolute;
  width: 2px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 182, 193, 0.3),
    rgba(255, 182, 193, 0.5),
    rgba(255, 182, 193, 0.3),
    transparent
  );
  animation: ribbonFlow 8s ease-in-out infinite;
}

@keyframes heartFloat {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg) scale(var(--scale, 1));
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  50% {
    transform: translate(20px, -30px) rotate(10deg) scale(var(--scale, 1));
    opacity: 1;
  }
  75% {
    opacity: 1;
  }
}

@keyframes orbGlow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes sparkleTwinkle {
  0%, 100% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.5);
  }
}

@keyframes ribbonFlow {
  0%, 100% {
    transform: translateY(-100%) scaleY(1);
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    transform: translateY(100%) scaleY(1.2);
  }
}
</style>