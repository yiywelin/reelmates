<template>
    <div class="loading-screen" :class="{ 'fade-out': isComplete }">
      <div class="logo-wrapper">
        <svg class="logo" viewBox="0 0 200 200">
          <!-- Circles (heads) -->
          <circle class="head-1" cx="65" cy="50" r="18" />
          <circle class="head-2" cx="110" cy="50" r="25" />
          
          <!-- Main body part "M" shape -->
          <path class="body" d="M45,80 L45,150 L75,150 L90,110 L105,150 L135,150 L135,80 Z" />
          
          <!-- Camera/screen part -->
          <path class="camera" d="M140,95 L140,135 L160,125 L160,105 Z" />
        </svg>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  
  const isComplete = ref(false);
  
  // Emit event when animations are complete
  const emit = defineEmits(['complete']);
  
  onMounted(() => {
    // Wait for logo animations to complete
    setTimeout(() => {
      isComplete.value = true;
      // Wait for fade-out animation before emitting
      setTimeout(() => {
        emit('complete');
      }, 500); // Match this with fade-out duration
    }, 2000); // Total duration of logo animations
  });
  </script>
  
  <style scoped>
  .loading-screen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #1a1a1a;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    margin: 0;
    padding: 0;
    overflow: hidden;
    opacity: 1;
    transition: opacity 0.5s ease;
  }
  
  .loading-screen.fade-out {
    opacity: 0;
  }
  
  /* Rest of your existing styles... */
  
  .logo-wrapper {
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .logo {
    width: 100%;
    height: 100%;
  }
  
  /* Initial state for animation */
  .head-1, .head-2, .body, .camera {
    fill: transparent;
    stroke: white;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
  }
  
  /* Animation for drawing and filling */
  .head-1 {
    animation: drawLine 1s ease forwards,
               fillPink 0.5s ease 1s forwards;
  }
  
  .head-2 {
    animation: drawLine 1s ease 0.2s forwards,
               fillPink 0.5s ease 1.2s forwards;
  }
  
  .body, .camera {
    animation: drawLine 1s ease 0.4s forwards,
               fillBlue 0.5s ease 1.4s forwards;
  }
  
  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }
  
  @keyframes fillPink {
    to {
      fill: #E752E7;
      stroke: none;
    }
  }
  
  @keyframes fillBlue {
    to {
      fill: #7B68EE;
      stroke: none;
    }
  }
  </style>