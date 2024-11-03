<!-- ComedyBackground.vue -->
<template>
    <div class="comedy-background">
      <TechGrid 
        primaryColor="rgba(255, 165, 0, 0.15)"
        glowColor="rgba(255, 165, 0, 0.4)"
      />
      
      <!-- Cartoon speech bubbles -->
      <div class="speech-bubbles">
        <div 
          v-for="n in 8" 
          :key="`bubble-${n}`" 
          class="speech-bubble"
          :style="getBubbleStyle(n)"
        >
          <div class="bubble-tail"></div>
        </div>
      </div>
  
      <!-- Comic style stars -->
      <div class="comic-stars">
        <div 
          v-for="n in 12" 
          :key="`star-${n}`" 
          class="comic-star"
          :style="getStarStyle(n)"
        >
          <div class="star-inner"></div>
        </div>
      </div>
  
      <!-- Dashed lines -->
      <div class="dashed-lines">
        <div 
          v-for="n in 6" 
          :key="`line-${n}`" 
          class="dashed-line"
          :style="getLineStyle(n)"
        ></div>
      </div>
  
      <!-- Comic style pows -->
      <div class="pows">
        <div 
          v-for="n in 5" 
          :key="`pow-${n}`" 
          class="pow"
          :style="getPowStyle(n)"
        >
          <div class="pow-inner"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const getBubbleStyle = (index) => ({
    left: `${Math.random() * 80}%`,
    top: `${Math.random() * 80}%`,
    transform: `scale(${0.5 + Math.random() * 0.5})`,
    animationDelay: `${index * 2}s`
  })
  
  const getStarStyle = (index) => ({
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 90}%`,
    transform: `rotate(${Math.random() * 45}deg) scale(${0.6 + Math.random() * 0.4})`,
    animationDelay: `${index * 0.5}s`
  })
  
  const getLineStyle = (index) => ({
    left: `${(index / 6) * 100}%`,
    top: `${Math.random() * 100}%`,
    transform: `rotate(${Math.random() * 90 - 45}deg)`,
    animationDelay: `${index * 0.8}s`
  })
  
  const getPowStyle = (index) => ({
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 90}%`,
    transform: `rotate(${Math.random() * 30 - 15}deg) scale(${0.7 + Math.random() * 0.3})`,
    animationDelay: `${index * 3}s`
  })
  </script>
  
  <style scoped>
  .comedy-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #2d2210, #000000);
    overflow: hidden;
  }
  
  /* Speech Bubbles */
  .speech-bubbles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .speech-bubble {
    position: absolute;
    width: 60px;
    height: 40px;
    background: rgba(255, 165, 0, 0.15);
    border-radius: 20px;
    animation: bubblePop 6s ease-in-out infinite;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .bubble-tail {
    position: absolute;
    bottom: -10px;
    width: 15px;
    height: 15px;
    background: rgba(255, 165, 0, 0.15);
    transform: rotate(45deg);
    border-radius: 2px;
  }
  
  /* Comic Stars */
  .comic-stars {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .comic-star {
    position: absolute;
    width: 30px;
    height: 30px;
    animation: starBurst 4s ease-in-out infinite;
  }
  
  .star-inner {
    width: 100%;
    height: 100%;
    background: rgba(255, 165, 0, 0.2);
    clip-path: polygon(
      50% 0%, 61% 35%, 98% 35%, 68% 57%, 
      79% 91%, 50% 70%, 21% 91%, 32% 57%, 
      2% 35%, 39% 35%
    );
  }
  
  /* Dashed Lines */
  .dashed-lines {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .dashed-line {
    position: absolute;
    width: 100px;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      rgba(255, 165, 0, 0.2),
      rgba(255, 165, 0, 0.2) 5px,
      transparent 5px,
      transparent 10px
    );
    animation: dashMove 8s linear infinite;
  }
  
  /* Comic Pows */
  .pows {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .pow {
    position: absolute;
    width: 50px;
    height: 50px;
    animation: powBurst 8s ease-in-out infinite;
  }
  
  .pow-inner {
    width: 100%;
    height: 100%;
    background: rgba(255, 165, 0, 0.15);
    clip-path: polygon(
      50% 0%, 80% 10%, 100% 35%, 90% 80%, 
      50% 100%, 10% 80%, 0% 35%, 20% 10%
    );
  }
  
  @keyframes bubblePop {
    0%, 100% {
      opacity: 0;
      transform: scale(0.5) translateY(0);
    }
    20%, 80% {
      opacity: 1;
      transform: scale(1) translateY(-20px);
    }
  }
  
  @keyframes starBurst {
    0%, 100% {
      opacity: 0;
      transform: var(--transform) scale(0.5);
    }
    50% {
      opacity: 1;
      transform: var(--transform) scale(1.2);
    }
  }
  
  @keyframes dashMove {
    0% {
      opacity: 0;
      transform: var(--transform) translateX(-100px);
    }
    20%, 80% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: var(--transform) translateX(100px);
    }
  }
  
  @keyframes powBurst {
    0%, 100% {
      opacity: 0;
      transform: var(--transform) scale(0.3);
    }
    10%, 90% {
      opacity: 1;
      transform: var(--transform) scale(1);
    }
  }
  </style>