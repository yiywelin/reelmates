<!-- FantasyBackground.vue -->
<template>
    <div class="fantasy-background">
      <TechGrid 
        primaryColor="rgba(186, 85, 211, 0.15)"
        glowColor="rgba(186, 85, 211, 0.4)"
      />
      
      <!-- Magical runes -->
      <div class="magic-runes">
        <div 
          v-for="n in 12" 
          :key="`rune-${n}`" 
          class="rune"
          :style="getRuneStyle(n)"
        >
          <div class="rune-symbol"></div>
          <div class="rune-glow"></div>
        </div>
      </div>
  
      <!-- Arcane circles -->
      <div class="arcane-circles">
        <div 
          v-for="n in 4" 
          :key="`circle-${n}`" 
          class="arcane-circle"
          :style="getCircleStyle(n)"
        >
          <div class="circle-inner"></div>
          <div class="circle-symbols"></div>
        </div>
      </div>
  
      <!-- Ethereal wisps -->
      <div class="ethereal-wisps">
        <div 
          v-for="n in 15" 
          :key="`wisp-${n}`" 
          class="wisp"
          :style="getWispStyle()"
        ></div>
      </div>
  
      <!-- Magical portals -->
      <div class="portals">
        <div 
          v-for="n in 3" 
          :key="`portal-${n}`" 
          class="portal"
          :style="getPortalStyle(n)"
        >
          <div class="portal-ripple"></div>
          <div class="portal-core"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const getRuneStyle = (index) => ({
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 90}%`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${index * 0.5}s`
  })
  
  const getCircleStyle = (index) => ({
    left: `${20 + (index * 20)}%`,
    top: `${30 + (Math.random() * 40)}%`,
    transform: `scale(${0.8 + Math.random() * 0.4})`,
    animationDelay: `${index * 2}s`
  })
  
  const getWispStyle = () => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${20 + Math.random() * 30}px`,
    height: `${20 + Math.random() * 30}px`,
    animationDuration: `${5 + Math.random() * 5}s`,
    animationDelay: `${Math.random() * 5}s`
  })
  
  const getPortalStyle = (index) => ({
    left: `${25 + (index * 25)}%`,
    top: `${40 + (Math.random() * 20)}%`,
    animationDelay: `${index * 2}s`
  })
  </script>
  
  <style scoped>
  .fantasy-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #2d1f3d, #000000);
    overflow: hidden;
  }
  
  /* Magical Runes */
  .magic-runes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .rune {
    position: absolute;
    width: 30px;
    height: 30px;
    animation: runeFloat 8s ease-in-out infinite;
  }
  
  .rune-symbol {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(186, 85, 211, 0.2);
    clip-path: polygon(
      50% 0%, 100% 25%, 100% 75%, 50% 100%, 
      0% 75%, 0% 25%
    );
  }
  
  .rune-glow {
    position: absolute;
    inset: -5px;
    background: radial-gradient(
      circle at center,
      rgba(186, 85, 211, 0.2),
      transparent 70%
    );
    animation: runeGlow 2s ease-in-out infinite;
  }
  
  /* Arcane Circles */
  .arcane-circles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .arcane-circle {
    position: absolute;
    width: 150px;
    height: 150px;
    animation: circleRotate 20s linear infinite;
  }
  
  .circle-inner {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(186, 85, 211, 0.3);
    border-radius: 50%;
  }
  
  .circle-symbols {
    position: absolute;
    inset: 0;
    border: 1px solid rgba(186, 85, 211, 0.2);
    border-radius: 50%;
    &::before,
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border: 1px solid rgba(186, 85, 211, 0.2);
      border-radius: 50%;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }
  }
  
  /* Ethereal Wisps */
  .ethereal-wisps {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .wisp {
    position: absolute;
    background: radial-gradient(
      circle at center,
      rgba(186, 85, 211, 0.2),
      transparent 70%
    );
    border-radius: 50%;
    animation: wispFloat 8s ease-in-out infinite;
    filter: blur(5px);
  }
  
  /* Magical Portals */
  .portals {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .portal {
    position: absolute;
    width: 80px;
    height: 80px;
    animation: portalPulse 4s ease-in-out infinite;
  }
  
  .portal-ripple {
    position: absolute;
    inset: 0;
    border: 2px solid rgba(186, 85, 211, 0.3);
    border-radius: 50%;
    animation: portalRipple 3s ease-out infinite;
  }
  
  .portal-core {
    position: absolute;
    inset: 25%;
    background: radial-gradient(
      circle at center,
      rgba(186, 85, 211, 0.4),
      transparent 70%
    );
    border-radius: 50%;
    animation: portalCore 2s ease-in-out infinite;
  }
  
  @keyframes runeFloat {
    0%, 100% {
      transform: var(--transform) translateY(0) rotate(0deg);
    }
    50% {
      transform: var(--transform) translateY(-20px) rotate(180deg);
    }
  }
  
  @keyframes runeGlow {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }
  
  @keyframes circleRotate {
    0% {
      transform: var(--transform) rotate(0deg);
    }
    100% {
      transform: var(--transform) rotate(360deg);
    }
  }
  
  @keyframes wispFloat {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translate(30px, -30px) scale(1.2);
      opacity: 0.7;
    }
  }
  
  @keyframes portalPulse {
    0%, 100% {
      transform: var(--transform) scale(1);
    }
    50% {
      transform: var(--transform) scale(1.1);
    }
  }
  
  @keyframes portalRipple {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }
  
  @keyframes portalCore {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  </style>