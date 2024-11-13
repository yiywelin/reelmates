<template>
  <div class="loading-screen" :class="{ 'fade-out': isComplete }">
    <div class="logo-container">
      <svg class="logo" viewBox="0 0 861.12 788.4">
        <!-- Circles (heads) -->
        <g id="Ellipse_1_copy">
          <path id="ellipse-path" class="cls-ellipse" 
            d="M496.93,0C412.82,0,344.64,68.2,344.64,152.34s68.19,152.34,152.3,152.34,152.3-68.2,152.3-152.34S581.04,0,496.93,0ZM162.35,95.38c-57.78,0-104.62,46.85-104.62,104.65s46.84,104.65,104.62,104.65,104.62-46.85,104.62-104.65-46.84-104.65-104.62-104.65Z" 
          />
        </g>
        <!-- Main body part -->
        <g id="Rectangle_2_copy">
          <path id="rect-path" class="cls-rect" 
            d="M256.55,334.83c-3.73-5.41-9.89-8.63-16.46-8.63H6.76c-3.98,0-7.2,3.22-7.2,7.2v447.6c0,3.98,3.22,7.2,7.2,7.2h231.6c3.98,0,7.2-3.22,7.2-7.2v-256.71l11.1,14.34,69.02-103.7-69.13-100.09ZM847.1,392.73l-148.66,58.47c-3.08,1.21-5.52,4.89-5.52,8.24v195.43c0,3.35,2.44,7.03,5.52,8.24l148.66,58.47c7.63,3,14.03,1.07,14.03-4.42v-320.01c0-5.49-6.39-7.42-14.03-4.42ZM649.63,325.92h-225.51c-3.8,0-7.36,1.87-9.51,5-43.79,63.74-148.89,219.84-148.89,219.84l66.01,81.55c6.48,8.01,18.81,7.61,24.76-.8l64.84-91.61v241.29c0,3.98,3.08,7.2,6.88,7.2h221.42c3.8,0,6.88-3.22,6.88-7.2v-448.08c0-3.98-3.08-7.2-6.88-7.2Z" 
          />
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isComplete = ref(false);
const emit = defineEmits(['complete']);

onMounted(() => {
  // Wait for logo animations to complete (1s draw + 1s fill)
  setTimeout(() => {
    isComplete.value = true;
    // Wait for fade-out animation before emitting complete
    setTimeout(() => {
      emit('complete');
    }, 500); // Fade out duration
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

.logo-container {
  background-color: #1a1a1a;
  padding: 20px;
  width: 300px;
  height: auto;
}

.logo {
  width: 100%;
  height: 100%;
  display: block;
}

.cls-rect, 
.cls-ellipse {
  fill: transparent;
  stroke: white;
  stroke-width: 3px;
  stroke-dasharray: 4500;
  stroke-dashoffset: 4500;
  animation: draw 1s ease forwards, fillAnimation 1s ease 1s forwards;
}

.cls-rect {
  --fill-color: #000000;
}

.cls-ellipse {
  --fill-color: #6D64FF;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fillAnimation {
  to {
    fill: var(--fill-color);
    stroke: transparent;
  }
}
</style>