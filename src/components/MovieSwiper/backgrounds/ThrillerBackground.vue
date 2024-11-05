<!-- ThrillerBackground.vue -->
<template>
    <div class="thriller-background">
      <TechGrid 
        primaryColor="rgba(139, 0, 0, 0.15)"
        glowColor="rgba(220, 20, 60, 0.4)"
      />
      
      <!-- Blood drips -->
      <div class="blood-drips">
        <div 
          v-for="n in 15" 
          :key="`drip-${n}`" 
          class="blood-drip"
          :style="getDripStyle()"
        >
          <div class="drip-head"></div>
          <div class="drip-trail"></div>
        </div>
      </div>
  
      <!-- Blood splatters -->
      <div class="blood-splatters">
        <div 
          v-for="n in 8" 
          :key="`splatter-${n}`" 
          class="blood-splatter"
          :style="getSplatterStyle()"
        ></div>
      </div>
  
      <!-- Pulsing veins -->
      <div class="veins">
        <div 
          v-for="n in 6" 
          :key="`vein-${n}`" 
          class="vein"
          :style="getVeinStyle(n)"
        ></div>
      </div>
  
      <!-- Dark mist -->
      <div class="dark-mist">
        <div 
          v-for="n in 4" 
          :key="`mist-${n}`" 
          class="mist-layer"
          :style="getMistStyle(n)"
        ></div>
      </div>
  
      <!-- Blood pool -->
      <div class="blood-pools">
        <div 
          v-for="n in 5" 
          :key="`pool-${n}`" 
          class="blood-pool"
          :style="getPoolStyle()"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const getDripStyle = () => ({
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${8 + Math.random() * 7}s`,
    opacity: 0.7 + Math.random() * 0.3
  })
  
  const getSplatterStyle = () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    transform: `scale(${0.5 + Math.random() * 1}) rotate(${Math.random() * 360}deg)`,
    animationDelay: `${Math.random() * 10}s`
  })
  
  const getVeinStyle = (index) => ({
    left: `${(index / 6) * 100}%`,
    animationDelay: `${index * 0.5}s`,
    transform: `rotate(${Math.random() * 90 - 45}deg)`
  })
  
  const getMistStyle = (index) => ({
    left: `${(index / 4) * 100 - 25}%`,
    animationDelay: `${index * 2}s`,
    opacity: 0.1 + Math.random() * 0.1
  })
  
  const getPoolStyle = () => ({
    left: `${Math.random() * 100}%`,
    bottom: '0',
    width: `${100 + Math.random() * 200}px`,
    height: `${50 + Math.random() * 50}px`,
    animationDelay: `${Math.random() * 5}s`
  })
  </script>
  
  <style scoped>
  .thriller-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #1a0000, #000000);
    overflow: hidden;
  }
  
  /* Blood Drips */
  .blood-drips {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .blood-drip {
    position: absolute;
    width: 3px;
    animation: drip 10s linear infinite;
  }
  
  .drip-head {
    width: 8px;
    height: 8px;
    background: #8B0000;
    border-radius: 50%;
    filter: blur(1px);
    box-shadow: 0 0 5px rgba(139, 0, 0, 0.8);
  }
  
  .drip-trail {
    width: 2px;
    height: 20px;
    background: linear-gradient(to bottom, #8B0000, transparent);
    margin-left: 3px;
  }
  
  /* Blood Splatters */
  .blood-splatters {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .blood-splatter {
    position: absolute;
    width: 50px;
    height: 50px;
    background-image: radial-gradient(circle, #8B0000 0%, transparent 70%);
    animation: splatter 15s ease-in-out infinite;
    filter: blur(1px);
  }
  
  /* Pulsing Veins */
  .veins {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .vein {
    position: absolute;
    width: 2px;
    height: 200px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(139, 0, 0, 0.5),
      rgba(139, 0, 0, 0.8),
      rgba(139, 0, 0, 0.5),
      transparent
    );
    animation: pulse 3s ease-in-out infinite;
  }
  
  /* Dark Mist */
  .dark-mist {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .mist-layer {
    position: absolute;
    width: 150%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 0, 0, 0.3),
      transparent
    );
    filter: blur(8px);
    animation: mistFlow 20s linear infinite;
  }
  
  /* Blood Pools */
  .blood-pools {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .blood-pool {
    position: absolute;
    background: radial-gradient(ellipse at center, #8B0000 0%, transparent 70%);
    filter: blur(2px);
    animation: poolPulse 5s ease-in-out infinite;
  }
  
  @keyframes drip {
    0% {
      height: 0;
      transform: translateY(-100%);
    }
    100% {
      height: 100%;
      transform: translateY(100%);
    }
  }
  
  @keyframes splatter {
    0%, 100% {
      opacity: 0;
      transform: scale(var(--scale)) rotate(var(--rotation));
    }
    10%, 90% {
      opacity: 0.8;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scaleX(1) rotate(var(--rotation));
    }
    50% {
      opacity: 0.8;
      transform: scaleX(1.5) rotate(var(--rotation));
    }
  }
  
  @keyframes mistFlow {
    0% {
      transform: translateX(-30%);
    }
    100% {
      transform: translateX(0%);
    }
  }
  
  @keyframes poolPulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 0.6;
      transform: scale(1.1);
    }
  }
  </style>