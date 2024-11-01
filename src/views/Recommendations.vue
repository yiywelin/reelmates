<template>
  <div class="min-h-screen bg-[#0A0A1F] flex flex-col">
    <!-- Fixed height nav container -->
    <div class="h-[70px] flex-shrink-0">
      <NavBar />
    </div>
    
    <!-- Main content that takes remaining height -->
    <div class="flex-grow relative">
      <div class="relative flex flex-col items-center p-4 md:p-8 text-[#070D0D] z-10">
        <TheatricalBackground />
        
        <!-- Hero Section -->
        <div class="text-center mb-16 animate-fadeIn mt-12">
          <div>
            <span class="text-xl md:text-3xl lg:text-4xl font-semibold text-[#FF6961] animate-neonFlicker 
              [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF]">
              Your Recommended Movies
            </span>
          </div>
        </div>

        <!-- Movie Carousel -->
        <div class="relative w-full max-w-[1600px] mx-auto px-4 md:px-16 lg:px-20">
          <!-- Navigation Buttons -->
          <button 
            class="absolute top-1/2 -translate-y-1/2 w-12 md:w-16 h-12 md:h-16 rounded-full
              bg-[rgba(103,95,242,0.1)] backdrop-blur-md text-white cursor-pointer transition-all
              duration-300 z-10 left-2 md:left-8 disabled:opacity-0 disabled:cursor-default
              hover:bg-[rgba(103,95,242,0.2)] hover:scale-110 group"
            @click="prev"
            :disabled="currentIndex === 0"
            :class="{ 'opacity-0 pointer-events-none': currentIndex === 0 }"
            aria-label="Previous movies"
          >
            <div class="flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-90">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
          </button>

          <div 
            class="overflow-hidden -mx-4 md:-mx-6 lg:-mx-8"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            ref="carouselRef"
          >
            <div 
              class="flex"
              :style="{ 
                transform: `translateX(-${currentIndex * (100 / visibleMovies)}%)`,
                transition: isAnimating ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
              }"
            >
              <div 
                v-for="movie in movies" 
                :key="movie.id"
                :style="{ flex: `0 0 ${100 / visibleMovies}%` }"
                class="px-4 md:px-6 lg:px-8 relative rounded-2xl cursor-pointer overflow-hidden
                  transition-transform duration-300 ease-in-out hover:-translate-y-3 group"
                @click="selectMovie(movie)"
              >
                <div class="relative pb-[150%]">
                  <img 
                    :src="movie.imageUrl" 
                    :alt="movie.title"
                    class="absolute inset-0 w-full h-full object-cover rounded-2xl
                      transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl"
                  />
                  <div class="absolute inset-x-0 bottom-0 p-6 md:p-8 lg:p-10 bg-gradient-to-t 
                    from-[rgba(10,10,31,0.95)] via-[rgba(10,10,31,0.7)] to-transparent 
                    rounded-b-2xl translate-y-full transition-transform duration-300 
                    group-hover:translate-y-0">
                    <h3 class="text-lg md:text-xl lg:text-2xl font-semibold text-white m-0 
                      [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                      {{ movie.title }}
                    </h3>
                    <div class="mt-3 md:mt-5 opacity-0 translate-y-5 transition-all duration-300 
                      group-hover:opacity-100 group-hover:translate-y-0">
                      <span class="inline-block px-4 py-2 md:px-6 md:py-3 bg-[#675FF2] text-white 
                        rounded-lg text-sm md:text-base font-medium transition-all duration-300 
                        hover:bg-[#7B74FF] hover:-translate-y-0.5
                        hover:shadow-[0_4px_12px_rgba(103,95,242,0.3)]">
                        View Details
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button 
            class="absolute top-1/2 -translate-y-1/2 w-12 md:w-16 h-12 md:h-16 rounded-full
              bg-[rgba(103,95,242,0.1)] backdrop-blur-md text-white cursor-pointer transition-all
              duration-300 z-10 right-2 md:right-8 disabled:opacity-0 disabled:cursor-default
              hover:bg-[rgba(103,95,242,0.2)] hover:scale-110 group"
            @click="next"
            :disabled="currentIndex >= movies.length - visibleMovies"
            :class="{ 'opacity-0 pointer-events-none': currentIndex >= movies.length - visibleMovies }"
            aria-label="Next movies"
          >
            <div class="flex items-center justify-center w-full h-full transition-transform duration-300 group-hover:scale-90">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Script and Style sections remain the same -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import TheatricalBackground from '../components/Backgrounds/TheatricalBlackBackground.vue'
import NavBar from '../components/ui/NavBar.vue'
import { scifiMovies as movies } from '../data/movies'

const router = useRouter()
const currentIndex = ref(0)
const isAnimating = ref(false)
const touchStart = ref(null)
const touchEnd = ref(null)
const carouselRef = ref(null)
const visibleMovies = ref(3)

const updateVisibleMovies = () => {
  if (!carouselRef.value) return
  
  const width = window.innerWidth
  
  if (width < 640) {
    visibleMovies.value = 1 // Mobile
  } else if (width < 1024) {
    visibleMovies.value = 2 // Tablet
  } else {
    visibleMovies.value = 3 // Desktop and up
  }
  
  if (currentIndex.value > movies.length - visibleMovies.value) {
    currentIndex.value = Math.max(0, movies.length - visibleMovies.value)
  }
}

const next = () => {
  if (currentIndex.value < movies.length - visibleMovies.value) {
    isAnimating.value = true
    currentIndex.value++
  }
}

const prev = () => {
  if (currentIndex.value > 0) {
    isAnimating.value = true
    currentIndex.value--
  }
}

const selectMovie = (movie) => {
  router.push({
    path: `/movies/${movie.id}`,
    query: { title: movie.title }
  })
}

const handleTouchStart = (e) => {
  touchStart.value = e.touches[0].clientX
  touchEnd.value = touchStart.value
  isAnimating.value = false
}

const handleTouchMove = (e) => {
  touchEnd.value = e.touches[0].clientX
}

const handleTouchEnd = () => {
  if (!touchStart.value || !touchEnd.value) return
  
  const distance = touchStart.value - touchEnd.value
  const minSwipeDistance = 50

  if (Math.abs(distance) >= minSwipeDistance) {
    isAnimating.value = true
    if (distance > 0) {
      next()
    } else {
      prev()
    }
  }

  touchStart.value = null
  touchEnd.value = null
}

const handleKeydown = (e) => {
  if (e.key === 'ArrowLeft') {
    prev()
  } else if (e.key === 'ArrowRight') {
    next()
  }
}

const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  updateVisibleMovies()
  window.addEventListener('resize', debounce(updateVisibleMovies, 250))
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', updateVisibleMovies)
})
</script>

<style>
@keyframes neonFlicker {
  0%, 100% { opacity: 1; }
  90% { opacity: 1; }
  95% { opacity: 0.8; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-neonFlicker {
  animation: neonFlicker 2s infinite;
}

.animate-fadeIn {
  animation: fadeIn 1s ease-out;
}
</style>