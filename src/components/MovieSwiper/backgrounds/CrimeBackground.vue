<!-- CrimeBackground.vue -->
<template>
    <div class="crime-background">
      <TechGrid 
        primaryColor="rgba(50, 50, 50, 0.15)"
        glowColor="rgba(50, 50, 50, 0.4)"
      />
      
      <!-- Evidence connections -->
      <div class="connections">
        <div 
          v-for="n in 8" 
          :key="`connection-${n}`" 
          class="connection-line"
          :style="getConnectionStyle(n)"
        >
          <div class="connection-dot start"></div>
          <div class="connection-dot end"></div>
        </div>
      </div>
  
      <!-- Newspaper clippings -->
      <div class="newspapers">
        <div 
          v-for="n in 6" 
          :key="`paper-${n}`" 
          class="newspaper"
          :style="getNewspaperStyle(n)"
        >
          <div class="paper-content">
            <div class="paper-line" v-for="i in 4" :key="i"></div>
          </div>
        </div>
      </div>
  
      <!-- Investigation notes -->
      <div class="notes">
        <div 
          v-for="n in 5" 
          :key="`note-${n}`" 
          class="note"
          :style="getNoteStyle(n)"
        >
          <div 
            v-for="line in 3" 
            :key="`line-${line}`" 
            class="note-line"
            :style="{ width: `${30 + Math.random() * 40}%` }"
          ></div>
        </div>
      </div>
  
      <!-- Detective elements -->
      <div class="detective-elements">
        <div 
          v-for="n in 4" 
          :key="`element-${n}`" 
          class="detective-element"
          :style="getDetectiveElementStyle(n)"
        >
          <div class="magnifying-glass"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const getConnectionStyle = (index) => {
    const start = {
      x: Math.random() * 100,
      y: Math.random() * 100
    }
    const end = {
      x: Math.random() * 100,
      y: Math.random() * 100
    }
    const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2))
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI)
    
    return {
      left: `${start.x}%`,
      top: `${start.y}%`,
      width: `${length}%`,
      transform: `rotate(${angle}deg)`,
      animationDelay: `${index * 0.5}s`
    }
  }
  
  const getNewspaperStyle = (index) => ({
    left: `${Math.random() * 80}%`,
    top: `${Math.random() * 80}%`,
    transform: `rotate(${Math.random() * 30 - 15}deg)`,
    animationDelay: `${index * 0.8}s`
  })
  
  const getNoteStyle = (index) => ({
    left: `${Math.random() * 80}%`,
    top: `${Math.random() * 80}%`,
    transform: `rotate(${Math.random() * 20 - 10}deg)`,
    animationDelay: `${index * 0.5}s`
  })
  
  const getDetectiveElementStyle = (index) => ({
    left: `${20 + (index * 20)}%`,
    top: `${30 + (Math.random() * 40)}%`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${index * 1}s`
  })
  </script>
  
  <style scoped>
  .crime-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #1a1a1a, #000000);
    overflow: hidden;
  }
  
  /* Evidence Connections */
  .connections {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .connection-line {
    position: absolute;
    height: 2px;
    background: rgba(255, 0, 0, 0.1);
    transform-origin: left center;
    animation: connectionAppear 4s ease-in-out infinite;
  }
  
  .connection-dot {
    position: absolute;
    width: 8px;
    height: 8px;
    background: rgba(255, 0, 0, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
  
  .connection-dot.start {
    left: 0;
    animation: dotPulse 2s ease-in-out infinite;
  }
  
  .connection-dot.end {
    right: 0;
    animation: dotPulse 2s ease-in-out infinite 1s;
  }
  
  /* Newspaper Clippings */
  .newspapers {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .newspaper {
    position: absolute;
    width: 120px;
    height: 80px;
    background: rgba(255, 255, 255, 0.05);
    padding: 10px;
    animation: paperFloat 10s ease-in-out infinite;
  }
  
  .paper-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  
  .paper-line {
    height: 2px;
    background: rgba(255, 255, 255, 0.1);
    width: 100%;
  }
  
  /* Investigation Notes */
  .notes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .note {
    position: absolute;
    width: 100px;
    height: 60px;
    background: rgba(255, 255, 255, 0.03);
    padding: 8px;
    animation: noteReveal 8s ease-in-out infinite;
  }
  
  .note-line {
    height: 2px;
    background: rgba(255, 255, 255, 0.08);
    margin: 8px 0;
  }
  
  /* Detective Elements */
  .detective-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .detective-element {
    position: absolute;
    width: 40px;
    height: 40px;
    animation: elementFloat 6s ease-in-out infinite;
  }
  
  .magnifying-glass {
    position: relative;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      right: -8px;
      width: 2px;
      height: 12px;
      background: rgba(255, 255, 255, 0.1);
      transform: rotate(45deg);
    }
  }
  
  @keyframes connectionAppear {
    0%, 100% {
      opacity: 0.1;
    }
    50% {
      opacity: 0.3;
    }
  }
  
  @keyframes dotPulse {
    0%, 100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.5);
      opacity: 0.6;
    }
  }
  
  @keyframes paperFloat {
    0%, 100% {
      transform: var(--transform) translateY(0);
    }
    50% {
      transform: var(--transform) translateY(-20px);
    }
  }
  
  @keyframes noteReveal {
    0%, 100% {
      opacity: 0.1;
      transform: var(--transform) scale(0.95);
    }
    50% {
      opacity: 0.3;
      transform: var(--transform) scale(1);
    }
  }
  
  @keyframes elementFloat {
    0%, 100% {
      transform: var(--transform) translateY(0);
    }
    50% {
      transform: var(--transform) translateY(-15px);
    }
  }
  </style>