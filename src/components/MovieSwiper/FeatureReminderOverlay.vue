<!-- FeatureReminderOverlay.vue -->
<template>
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 pointer-events-auto">
      <div class="bg-[#0a0a1f] border border-[#DB3DCF] rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <!-- Close button -->
        <button 
          @click="$emit('close')"
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12" 
            />
          </svg>
        </button>
        
        <h2 class="text-2xl font-bold text-white mb-4">
          Discover More Features!
        </h2>
        
        <p class="text-gray-300 mb-6">
            You're on fire! Want to make movie nights even more awesome? Check these out:
        </p>
        
        <div class="space-y-4">
          <button
            @click="$emit('navigate', '/for-you')"
            class="w-full p-4 rounded-lg transition-opacity hover:opacity-90"
            style="background: linear-gradient(to right, #DB3DCF, #675FF2)"
          >
            <h3 class="text-lg font-semibold text-white mb-1">For You</h3>
            <p class="text-sm text-gray-200">
                Unlock personalized movie picks tailored to your swipes!
            </p>
          </button>
          
          <button
            @click="$emit('navigate', '/watch-with-friends')"
            class="w-full p-4 rounded-lg transition-opacity hover:opacity-90"
            style="background: linear-gradient(to right, #DB3DCF, #675FF2)"
          >
            <h3 class="text-lg font-semibold text-white mb-1">Watch with Friends</h3>
            <p class="text-sm text-gray-200">
                Find flicks you and your friend will both love.
            </p>
          </button>
        </div>
        
        <div class="mt-6 text-center">
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Continue Swiping
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FeatureReminderOverlay',
    emits: ['close', 'navigate']
  }
  </script>
  
  <style scoped>
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
  </style>