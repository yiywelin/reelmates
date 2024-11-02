<!-- AnimationBackground.vue -->
<template>
    <div class="animation-background">
      <TechGrid 
        primaryColor="rgba(0, 255, 127, 0.15)"
        glowColor="rgba(0, 255, 127, 0.4)"
      />
      
      <!-- Bouncing shapes -->
      <div class="bouncing-shapes">
        <div 
          v-for="n in 12" 
          :key="`shape-${n}`" 
          class="shape"
          :style="getShapeStyle(n)"
        ></div>
      </div>
  
      <!-- Floating doodles -->
      <div class="doodles">
        <div 
          v-for="n in 8" 
          :key="`doodle-${n}`" 
          class="doodle"
          :style="getDoodleStyle(n)"
        >
          <div class="doodle-line"></div>
          <div class="doodle-circle"></div>
          <div class="doodle-square"></div>
        </div>
      </div>
  
      <!-- Squiggly lines -->
      <div class="squiggles">
        <div 
          v-for="n in 6" 
          :key="`squiggle-${n}`" 
          class="squiggle"
          :style="getSquiggleStyle(n)"
        ></div>
      </div>
  
      <!-- Pop bubbles -->
      <div class="pop-bubbles">
        <div 
          v-for="n in 15" 
          :key="`bubble-${n}`" 
          class="bubble"
          :style="getBubbleStyle()"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>
  import TechGrid from './TechGrid.vue'
  
  const colors = [
    '#00FF7F', // Spring green
    '#FFD700', // Gold
    '#FF69B4', // Hot pink
    '#4DB5FF', // Bright blue
    '#FFA500', // Orange
    '#9370DB'  // Purple
  ]
  
  const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)]
  
  const getShapeStyle = (index) => {
    const shapes = [
      'circle(50% at 50% 50%)',
      'polygon(50% 0%, 100% 100%, 0% 100%)',
      'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
    ]
    
    return {
      clipPath: shapes[index % shapes.length],
      backgroundColor: getRandomColor(),
      left: `${Math.random() * 90}%`,
      top: `${Math.random() * 90}%`,
      animationDelay: `${index * 0.3}s`,
      animationDuration: `${4 + Math.random() * 4}s`
    }
  }
  
  const getDoodleStyle = (index) => ({
    left: `${Math.random() * 90}%`,
    top: `${Math.random() * 90}%`,
    transform: `rotate(${Math.random() * 360}deg)`,
    animationDelay: `${index * 0.5}s`,
    '--doodle-color': getRandomColor()
  })
  
  const getSquiggleStyle = (index) => ({
    left: `${(index / 6) * 100}%`,
    backgroundColor: getRandomColor(),
    animationDelay: `${index * -1}s`,
    animationDuration: `${8 + Math.random() * 4}s`
  })
  
  const getBubbleStyle = () => ({
    left: `${Math.random() * 100}%`,
    animationDuration: `${3 + Math.random() * 4}s`,
    animationDelay: `${Math.random() * 2}s`,
    backgroundColor: getRandomColor(),
    transform: `scale(${0.5 + Math.random() * 0.5})`
  })
  </script>
  
  <style scoped>
  .animation-background {
    position: fixed;
    inset: 0;
    background: linear-gradient(135deg, #1a2f1f, #000000);
    overflow: hidden;
  }
  
  /* Bouncing Shapes */
  .bouncing-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .shape {
    position: absolute;
    width: 30px;
    height: 30px;
    opacity: 0.6;
    animation: bounce 4s ease-in-out infinite;
    filter: brightness(1.2);
  }
  
  /* Floating Doodles */
  .doodles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .doodle {
    position: absolute;
    width: 50px;
    height: 50px;
    animation: float 8s ease-in-out infinite;
  }
  
  .doodle-line {
    position: absolute;
    width: 100%;
    height: 2px;
    background-color: var(--doodle-color);
    top: 50%;
    animation: wiggle 3s ease-in-out infinite;
  }
  
  .doodle-circle {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid var(--doodle-color);
    border-radius: 50%;
    top: 20%;
    left: 20%;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .doodle-square {
    position: absolute;
    width: 10px;
    height: 10px;
    border: 2px solid var(--doodle-color);
    bottom: 20%;
    right: 20%;
    animation: rotate 3s linear infinite;
  }
  
  /* Squiggly Lines */
  .squiggles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .squiggle {
    position: absolute;
    width: 2px;
    height: 100px;
    animation: squiggle 8s ease-in-out infinite;
  }
  
  /* Pop Bubbles */
  .pop-bubbles {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }
  
  .bubble {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    opacity: 0.6;
    animation: float-up 4s ease-in-out infinite;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    50% {
      transform: translate(20px, -30px) scale(1.1);
    }
  }
  
  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) rotate(var(--rotation));
    }
    50% {
      transform: translate(30px, -20px) rotate(calc(var(--rotation) + 180deg));
    }
  }
  
  @keyframes wiggle {
    0%, 100% {
      transform: scaleX(0.8);
    }
    50% {
      transform: scaleX(1.2);
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
  }
  
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  
  @keyframes squiggle {
    0%, 100% {
      transform: translateY(-100%) scaleY(1);
    }
    50% {
      transform: translateY(100%) scaleY(1.2);
    }
  }
  
  @keyframes float-up {
    0% {
      transform: translateY(100%) scale(var(--scale));
      opacity: 0;
    }
    20% {
      opacity: 0.6;
    }
    80% {
      opacity: 0.6;
    }
    100% {
      transform: translateY(-100%) scale(var(--scale));
      opacity: 0;
    }
  }
  </style>