<!-- DramaBackground.vue -->
<template>
    <div class="drama-background">
      <TechGrid 
        primaryColor="rgba(147, 112, 219, 0.15)"
        glowColor="rgba(147, 112, 219, 0.4)"
      />
      
      <!-- Subtle gradient overlay -->
      <div class="gradient-overlay"></div>
      
      <!-- Floating brushstrokes -->
      <div class="brushstrokes">
        <div 
          v-for="n in 12" 
          :key="`brush-${n}`" 
          class="brushstroke"
          :style="getBrushStyle(n)"
        ></div>
      </div>
  
      <!-- Ink flows -->
      <div class="ink-flows">
        <div 
          v-for="n in 6" 
          :key="`ink-${n}`" 
          class="ink-flow"
          :style="getInkStyle(n)"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const getBrushStyle = (index) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${50 + Math.random() * 100}px`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${index * 0.5}s`,
    opacity: 0.1 + Math.random() * 0.1
  })
  
  const getInkStyle = (index) => ({
    left: `${(index / 6) * 100}%`,
    height: `${200 + Math.random() * 100}px`,
    animationDelay: `${index * -2}s`,
    opacity: 0.1 + (index * 0.02)
  })
  </script>
  
  <style scoped>
  .drama-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #1a1624, #000000);
    overflow: hidden;
  }
  
  /* Gradient Overlay */
  .gradient-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at center,
      transparent 0%,
      rgba(26, 22, 36, 0.8) 100%
    );
    pointer-events: none;
  }
  
  /* Brushstrokes */
  .brushstrokes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .brushstroke {
    position: absolute;
    height: 2px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(147, 112, 219, 0.2),
      transparent
    );
    animation: brushFloat 15s ease-in-out infinite;
  }
  
  /* Ink Flows */
  .ink-flows {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .ink-flow {
    position: absolute;
    width: 2px;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(147, 112, 219, 0.15),
      transparent
    );
    animation: inkFlow 10s ease-in-out infinite;
  }
  
  @keyframes brushFloat {
    0%, 100% {
      transform: translate(0, 0) rotate(var(--rotation));
      opacity: var(--opacity);
    }
    50% {
      transform: translate(20px, -20px) rotate(var(--rotation));
      opacity: calc(var(--opacity) * 2);
    }
  }
  
  @keyframes inkFlow {
    0%, 100% {
      transform: translateY(-100%);
      opacity: 0;
    }
    50% {
      transform: translateY(100%);
      opacity: var(--opacity);
    }
  }
  </style>