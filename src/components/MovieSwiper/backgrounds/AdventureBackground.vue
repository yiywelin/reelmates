<!-- AdventureBackground.vue -->
<template>
    <div class="adventure-background">
      <TechGrid 
        primaryColor="rgba(205, 133, 63, 0.15)"
        glowColor="rgba(205, 133, 63, 0.4)"
      />
      
      <!-- Compass roses -->
      <div class="compass-roses">
        <div 
          v-for="n in 4" 
          :key="`compass-${n}`" 
          class="compass"
          :style="getCompassStyle(n)"
        >
          <div class="compass-inner">
            <div class="compass-needle"></div>
            <div class="compass-points"></div>
          </div>
        </div>
      </div>
  
      <!-- Map grid lines -->
      <div class="map-grid">
        <div 
          v-for="n in 12" 
          :key="`grid-x-${n}`" 
          class="grid-line horizontal"
          :style="getGridLineStyle(n, true)"
        ></div>
        <div 
          v-for="n in 12" 
          :key="`grid-y-${n}`" 
          class="grid-line vertical"
          :style="getGridLineStyle(n, false)"
        ></div>
      </div>
  
      <!-- Route paths -->
      <div class="route-paths">
        <div 
          v-for="n in 5" 
          :key="`path-${n}`" 
          class="route-path"
          :style="getRouteStyle(n)"
        >
          <div 
            v-for="d in 4" 
            :key="`dot-${d}`" 
            class="route-dot"
          ></div>
        </div>
      </div>
  
      <!-- Terrain markers -->
      <div class="terrain-markers">
        <div 
          v-for="n in 8" 
          :key="`marker-${n}`" 
          class="marker"
          :style="getMarkerStyle(n)"
        >
          <div class="marker-ring"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const getCompassStyle = (index) => ({
    left: `${20 + (index * 20)}%`,
    top: `${20 + (Math.random() * 60)}%`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${index * 2}s`
  })
  
  const getGridLineStyle = (index, isHorizontal) => ({
    [isHorizontal ? 'top' : 'left']: `${(index / 12) * 100}%`,
    opacity: 0.1 + (Math.random() * 0.1),
    animationDelay: `${index * 0.2}s`
  })
  
  const getRouteStyle = (index) => ({
    left: `${Math.random() * 80}%`,
    top: `${Math.random() * 80}%`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${index * 1.5}s`
  })
  
  const getMarkerStyle = (index) => ({
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 90}%`,
    animationDelay: `${index * 0.5}s`
  })
  </script>
  
  <style scoped>
  .adventure-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #2b1810, #000000);
    overflow: hidden;
  }
  
  /* Compass Roses */
  .compass-roses {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .compass {
    position: absolute;
    width: 100px;
    height: 100px;
    animation: compassRotate 20s linear infinite;
  }
  
  .compass-inner {
    position: relative;
    width: 100%;
    height: 100%;
    border: 2px solid rgba(205, 133, 63, 0.3);
    border-radius: 50%;
  }
  
  .compass-needle {
    position: absolute;
    top: 10%;
    left: 50%;
    width: 2px;
    height: 40%;
    background: linear-gradient(to bottom, 
      rgba(205, 133, 63, 0.8),
      rgba(205, 133, 63, 0.3)
    );
    transform-origin: bottom center;
    animation: needleSway 4s ease-in-out infinite;
  }
  
  .compass-points {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(205, 133, 63, 0.2);
    border-radius: 50%;
    &::before,
    &::after {
      content: '';
      position: absolute;
      background: rgba(205, 133, 63, 0.2);
    }
    &::before {
      top: 0;
      left: 50%;
      width: 1px;
      height: 100%;
    }
    &::after {
      top: 50%;
      left: 0;
      width: 100%;
      height: 1px;
    }
  }
  
  /* Map Grid */
  .map-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .grid-line {
    position: absolute;
    background: rgba(205, 133, 63, 0.1);
    animation: gridPulse 4s ease-in-out infinite;
  }
  
  .horizontal {
    width: 100%;
    height: 1px;
  }
  
  .vertical {
    width: 1px;
    height: 100%;
  }
  
  /* Route Paths */
  .route-paths {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .route-path {
    position: absolute;
    width: 150px;
    height: 2px;
    background: repeating-linear-gradient(
      90deg,
      rgba(205, 133, 63, 0.4),
      rgba(205, 133, 63, 0.4) 6px,
      transparent 6px,
      transparent 12px
    );
    animation: pathTrace 8s linear infinite;
  }
  
  .route-dot {
    position: absolute;
    width: 6px;
    height: 6px;
    background: rgba(205, 133, 63, 0.6);
    border-radius: 50%;
    animation: dotPulse 2s ease-in-out infinite;
  }
  
  /* Terrain Markers */
  .terrain-markers {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .marker {
    position: absolute;
    width: 20px;
    height: 20px;
    animation: markerPulse 3s ease-in-out infinite;
  }
  
  .marker-ring {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(205, 133, 63, 0.4);
    border-radius: 50%;
    animation: ringExpand 3s ease-out infinite;
  }
  
  @keyframes compassRotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes needleSway {
    0%, 100% {
      transform: rotate(-5deg);
    }
    50% {
      transform: rotate(5deg);
    }
  }
  
  @keyframes gridPulse {
    0%, 100% {
      opacity: var(--opacity);
    }
    50% {
      opacity: calc(var(--opacity) * 2);
    }
  }
  
  @keyframes pathTrace {
    0% {
      opacity: 0;
      transform: var(--transform) scaleX(0);
    }
    20%, 80% {
      opacity: 1;
      transform: var(--transform) scaleX(1);
    }
    100% {
      opacity: 0;
      transform: var(--transform) scaleX(0);
    }
  }
  
  @keyframes dotPulse {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  
  @keyframes markerPulse {
    0%, 100% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.2);
    }
  }
  
  @keyframes ringExpand {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  </style>