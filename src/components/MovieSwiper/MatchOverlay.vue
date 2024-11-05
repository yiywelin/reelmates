<!-- src/components/MovieSwiper/MatchOverlay.vue -->
<template>
  <div 
    class="fixed inset-0 flex items-center justify-center z-50"
    :class="showAnimation ? 'opacity-100' : 'opacity-0 pointer-events-none'"
  >
    <!-- Animated background with geometric shapes -->
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm overflow-hidden pointer-events-none">
      <div class="absolute inset-0 animate-pulse">
        <div 
          v-for="i in 20" 
          :key="i"
          class="absolute w-4 h-4 bg-purple-500/20 rotate-45"
          :style="{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${2 + Math.random() * 3}s infinite ease-in-out`
          }"
        />
      </div>
    </div>

    <!-- Confetti overlay -->
    <div class="fixed inset-0 pointer-events-none">
      <div 
        v-for="i in 50" 
        :key="i"
        class="absolute animate-confetti"
        :style="{
          left: `${Math.random() * 100}%`,
          top: '-20px',
          width: `${Math.random() * 10 + 5}px`,
          height: `${Math.random() * 10 + 5}px`,
          background: confettiColors[Math.floor(Math.random() * 4)],
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          transform: `rotate(${Math.random() * 360}deg)`,
          animationDuration: `${Math.random() * 2 + 2}s`,
          animationDelay: `${Math.random() * 0.5}s`
        }"
      />
    </div>

    <!-- Match content -->
    <div class="relative transform scale-100 animate-matchPopIn pointer-events-auto">
      <div class="bg-gradient-to-r from-purple-900/90 to-indigo-900/90 rounded-3xl p-8 max-w-lg w-full backdrop-blur-xl border border-purple-500/30">
        <!-- Match header -->
        <div class="text-center mb-6">
          <h2 class="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradientFlow">
            MATCH!
          </h2>
        </div>

        <!-- Matched users list -->
        <div class="space-y-4">
          <div 
            v-for="(match, index) in matches" 
            :key="index"
            class="bg-purple-900/50 rounded-xl p-4 transform animate-slideIn"
            :style="{ animationDelay: `${index * 0.2}s` }"
          >
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-glow">
                {{ match.friendEmail[0].toUpperCase() }}
              </div>
              <div>
                <p class="text-purple-200 font-medium">{{ match.friendEmail }}</p>
                <p class="text-sm text-purple-400">also liked {{ match.movieTitle }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action buttons -->
        <div class="mt-6 flex justify-center space-x-4">
            <button
                @click="closeOverlay"
                class="px-6 py-2 rounded-full bg-purple-500 text-white font-medium hover:bg-purple-600 transform hover:scale-105 transition-all cursor-pointer"
            >
                Keep Swiping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const { matches } = defineProps({
  matches: {
    type: Array,
    required: true
  }
})

const showAnimation = ref(false)
const confettiColors = ['#675FF2', '#DB3DCF', '#FFD700', '#00ff87']
const emit = defineEmits(['close'])

let timer

const closeOverlay = () => {
  showAnimation.value = false
  emit('close')
}

onMounted(() => {
  showAnimation.value = true
  timer = setTimeout(() => {
    closeOverlay()
  }, 5000)
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<style scoped>
@keyframes gradientFlow {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

@keyframes matchPopIn {
  0% { transform: scale(0.8); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes slideIn {
  0% { transform: translateX(-20px); opacity: 0; }
  100% { transform: translateX(0); opacity: 1; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(45deg); }
  50% { transform: translateY(-20px) rotate(45deg); }
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
  50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.8); }
}

@keyframes confetti {
  0% { 
    transform: translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% { 
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

.pointer-events-none {
  pointer-events: none;
}

.pointer-events-auto {
  pointer-events: auto;
}

button {
  cursor: pointer !important;
}

.animate-gradientFlow {
  background-size: 200% 200%;
  animation: gradientFlow 3s ease infinite;
}

.animate-matchPopIn {
  animation: matchPopIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.animate-confetti {
  animation: confetti 3s cubic-bezier(0.25, 0, 0.75, 1) forwards;
}
</style>