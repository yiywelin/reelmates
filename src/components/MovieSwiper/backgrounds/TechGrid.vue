<!-- TechGrid.vue -->
<template>
  <div class="tech-grid">
    <div 
      v-for="n in 100" 
      :key="n" 
      class="grid-cell"
      :class="{ 'active': isActive(n) }"
      :style="getCellStyle(n)"
      @mouseenter="activateCell(n)"
    >
      <div class="cell-content"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue'

// Define props
const props = defineProps({
  primaryColor: {
    type: String,
    default: 'rgba(77, 181, 255, 0.2)' // Default blue color
  },
  glowColor: {
    type: String,
    default: 'rgba(77, 181, 255, 0.5)'
  }
})

//const activeCell = ref(null)
const activeCells = ref(new Set())

const isActive = (index) => {
  return activeCells.value.has(index)
}

const getCellStyle = (index) => {
  const isActivated = isActive(index)
  return {
    '--primary-color': props.primaryColor,
    '--glow-color': props.glowColor,
    transition: 'all 0.3s ease',
    opacity: isActivated ? '1' : '0.3',
    transform: isActivated ? 'scale(1.1)' : 'scale(1)',
    '--delay': `${index * 0.02}s`
  }
}

const activateCell = (index) => {
  activeCells.value.add(index)
  
  // Activate neighboring cells
  const row = Math.floor(index / 10)
  const col = index % 10
  
  const neighbors = [
    index - 1, // left
    index + 1, // right
    index - 10, // top
    index + 10, // bottom
  ]
  
  neighbors.forEach(neighbor => {
    if (neighbor >= 0 && neighbor < 100) {
      const neighborRow = Math.floor(neighbor / 10)
      const neighborCol = neighbor % 10
      
      // Check if neighbor is adjacent
      if (Math.abs(neighborRow - row) <= 1 && Math.abs(neighborCol - col) <= 1) {
        activeCells.value.add(neighbor)
      }
    }
  })

  setTimeout(() => {
    activeCells.value.delete(index)
    neighbors.forEach(neighbor => {
      activeCells.value.delete(neighbor)
    })
  }, 1000)
}

// Random cell activation
onMounted(() => {
  setInterval(() => {
    const randomCell = Math.floor(Math.random() * 100)
    activateCell(randomCell)
  }, 2000)
})
</script>

<style scoped>
.tech-grid {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  gap: 4px;
  padding: 20px;
  pointer-events: none;
}

.grid-cell {
  position: relative;
  background: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  pointer-events: auto;
  overflow: hidden;
  animation: cellAppear 0.5s ease-out forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.cell-content {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, 
    transparent, 
    var(--primary-color),
    transparent
  );
  transform: translateX(-100%);
}

.grid-cell:hover {
  background: var(--glow-color);
  box-shadow: 0 0 10px var(--glow-color);
}

.grid-cell:hover .cell-content {
  animation: shimmer 1s ease-in-out infinite;
}

.grid-cell.active {
  background: var(--glow-color);
  box-shadow: 
    0 0 10px var(--glow-color),
    0 0 20px var(--glow-color);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes cellAppear {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>