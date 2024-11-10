<!-- SwipeInstructions.vue -->
<template>
    <Transition name="fade">
      <div v-if="showInstructions" class="swipe-instructions-overlay">
        <!-- Left swipe instruction -->
        <div class="instruction left-instruction">
          <div class="swipe-arrow left">
            <span>←</span>
          </div>
          <p>Swipe left to pass</p>
        </div>
        
        <!-- Movie card placeholder -->
        <div class="card-placeholder">
          <p>Swipe or use buttons below</p>
        </div>
        
        <!-- Right swipe instruction -->
        <div class="instruction right-instruction">
          <div class="swipe-arrow right">
            <span>→</span>
          </div>
          <p>Swipe right to like</p>
        </div>
        
        <!-- Dismiss button -->
        <button @click="dismissInstructions" class="dismiss-button">
          Got it!
        </button>
      </div>
    </Transition>
  </template>
  
  <script>
  export default {
    name: 'SwipeInstructions',
    data() {
      return {
        showInstructions: true
      }
    },
    created() {
      // Check if user has seen instructions before
      const hasSeenInstructions = localStorage.getItem('hasSeenSwipeInstructions')
      this.showInstructions = !hasSeenInstructions
    },
    methods: {
      dismissInstructions() {
        this.showInstructions = false
        localStorage.setItem('hasSeenSwipeInstructions', 'true')
      }
    }
  }
  </script>
  
  <style scoped>
  .swipe-instructions-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .instruction {
    position: absolute;
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .left-instruction {
    left: 20%;
  }
  
  .right-instruction {
    right: 20%;
  }
  
  .swipe-arrow {
    font-size: 3rem;
    color: white;
    animation: bounce 2s infinite;
  }
  
  .swipe-arrow.left {
    color: #DB3DCF; /* Match your reject/pass color */
  }
  
  .swipe-arrow.right {
    color: #675FF2; /* Match your like/accept color */
  }
  
  .card-placeholder {
    width: 300px;
    height: 450px;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
  }
  
  .dismiss-button {
    position: absolute;
    bottom: 20%;
    padding: 0.75rem 2rem;
    background-color: #675FF2;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1.1rem;
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateX(0);
    }
    40% {
      transform: translateX(-30px);
    }
    60% {
      transform: translateX(-15px);
    }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>