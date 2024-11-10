<template>
  <div class="main-content">
    <NavBar />
    <div class="theater-container">
      <TheatricalBackground />
      
      <!-- Hero Section -->
      <div class="hero-section">
        <!-- Neon Sign -->
        <div class="neon-sign">
          <span class="neon-text">Find Your Perfect Movie Match</span>
        </div>
      </div>

      <!-- Genre Selection -->
      <div class="floating-genres">
        <div class="genres-title">SELECT YOUR GENRES</div>
        <div class="genres-container">
          <div 
            v-for="(genre, index) in genres" 
            :key="genre.id"
            class="genre-button"
            :class="{ 'selected': selectedGenres.includes(genre.id) }"
            :style="{ animationDelay: `${index * 0.1}s` }"
            @click="toggleGenre(genre.id)"
          >
            <div class="neon-border"></div>
            <component :is="genre.icon" class="w-8 h-8 text-current" />
            <span class="genre-name">{{ genre.name }}</span>
            <div class="neon-glow"></div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="cta-section">
        <button 
          class="start-button"
          :class="{ 'active': canSwipe }"
          :disabled="!canSwipe"
          @click="startSwiping"
        >
          <span class="button-text">Start Matching</span>
          <div class="button-glow"></div>
          <div class="light-beam"></div>
        </button>

        <button 
          class="random-button"
          @click="selectRandom"
        >
          <span class="button-text">SURPRISE ME</span>
          <div class="neon-flicker"></div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import TheatricalBackground from '../components/Backgrounds/TheatricalBackground.vue'
import NavBar from '../components/ui/NavBar.vue'
import { 
  Flame,
  Laugh,
  Clapperboard,
  Map,
  Rocket,
  Sparkles,
  Ghost,
  Heart,
  Fingerprint,
  Palette
} from 'lucide-vue-next'

const router = useRouter()
const isOverflowing = ref(false)

const genres = [
  { id: 'action', name: 'Action', icon: Flame },
  { id: 'comedy', name: 'Comedy', icon: Laugh },
  { id: 'drama', name: 'Drama', icon: Clapperboard },
  { id: 'adventure', name: 'Adventure', icon: Map },
  { id: 'scifi', name: 'Science Fiction', icon: Rocket },
  { id: 'fantasy', name: 'Fantasy', icon: Sparkles },
  { id: 'thriller', name: 'Thriller', icon: Ghost },
  { id: 'romance', name: 'Romance', icon: Heart },
  { id: 'crime', name: 'Crime', icon: Fingerprint },
  { id: 'animation', name: 'Animation', icon: Palette }
]

const selectedGenres = ref([])
const canSwipe = computed(() => selectedGenres.value.length > 0)

const toggleGenre = (genreId) => {
  const index = selectedGenres.value.indexOf(genreId)
  if (index === -1) {
    selectedGenres.value.push(genreId)
  } else {
    selectedGenres.value.splice(index, 1)
  }
}

const selectRandom = () => {
  selectedGenres.value = ['popular']
  router.push({
    path: '/swipe',
    query: { genres: 'popular' }
  })
}

const startSwiping = () => {
  if (selectedGenres.value.length > 0) {
    router.push({
      path: '/swipe',
      query: { genres: selectedGenres.value.join(',') }
    })
  }
}

onMounted(() => {
  const container = document.querySelector('.genres-container')
  if (container) {
    isOverflowing.value = container.scrollHeight > container.clientHeight
  }
})
</script>

<style scoped>
.main-content {
  min-height: 100vh;
  background: #0A0A1F;
  padding-top: 70px;
  display: flex;
  flex-direction: column;
}

.theater-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 70px);
  width: 100%;
  padding: 2rem 1rem;
  color: #D0CCE3;
  z-index: 1;
}

.hero-section {
  text-align: center;
  width: 100%;
  margin-top: 1rem;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out;
}

.neon-sign {
  margin: 0;
}

.neon-text {
  font-size: 2.5rem;
  color: #DB3DCF;
  text-shadow: 
    0 0 5px #DB3DCF,
    0 0 10px #DB3DCF,
    0 0 20px #DB3DCF;
  animation: neonFlicker 2s infinite;
  word-wrap: break-word;
  padding: 0 1rem;
}

.floating-genres {
  width: 100%;
  max-width: 1200px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
  margin: 1rem 0;
  z-index: 2;
}

.genres-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 2rem;
  letter-spacing: 4px;
  color: #675FF2;
  text-shadow: 0 0 10px #675FF2;
}

.genres-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  padding: 1rem;
  overflow-y: auto;
  max-width: 1200px;
  margin: 0 auto;
}

.genre-button {
  position: relative;
  padding: 1rem;
  background: rgba(60, 57, 126, 0.2);
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  overflow: hidden;
  animation: float 0.5s ease-out forwards;
  opacity: 0;
  min-height: 120px;
}

.genre-button .w-8 {
  width: 2rem;
  height: 2rem;
}

.neon-border {
  position: absolute;
  inset: 0;
  border: 2px solid #675FF2;
  border-radius: 12px;
  box-shadow: 0 0 10px #675FF2;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.genre-name {
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
}

.genre-button:hover {
  transform: translateY(-5px);
}

.genre-button:hover .neon-border {
  opacity: 1;
  box-shadow: 0 0 20px #675FF2;
}

.genre-button.selected {
  background: rgba(219, 61, 207, 0.2);
}

.genre-button.selected .neon-border {
  border-color: #DB3DCF;
  box-shadow: 0 0 20px #DB3DCF;
}

.cta-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  align-items: center;
  margin-top: 2rem;
}

.start-button {
  position: relative;
  padding: 1.5rem 4rem;
  font-size: 1.5rem;
  font-weight: bold;
  background: none;
  border: 2px solid #675FF2;
  border-radius: 12px;
  color: #D0CCE3;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, #675FF2, #DB3DCF);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.light-beam {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg,
    transparent,
    rgba(103, 95, 242, 0.5),
    transparent
  );
  transform: translateX(-100%);
}

.start-button:hover:not(:disabled) .light-beam {
  animation: beam 2s infinite;
}

.start-button.active {
  border-color: #DB3DCF;
  box-shadow: 0 0 30px rgba(219, 61, 207, 0.5);
}

.start-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.random-button {
  background: none;
  border: none;
  color: #D0CCE3;
  font-size: 1.2rem;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
}

.random-button:hover {
  opacity: 1;
  text-shadow: 0 0 10px #D0CCE3;
}

@keyframes neonFlicker {
  0%, 100% { opacity: 1; }
  90% { opacity: 1; }
  95% { opacity: 0.8; }
}

@keyframes float {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes beam {
  100% { transform: translateX(100%); }
}

@media (max-width: 768px) {
  .main-content {
    padding-top: 60px;
  }

  .theater-container {
    min-height: calc(100vh - 60px);
    padding: 1rem;
  }

  .hero-section {
    margin-top: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .neon-text {
    font-size: 1.8rem;
  }

  .genres-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .genres-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .genre-button {
    padding: 0.8rem;
    min-height: 100px;
  }

  .genre-button .w-8 {
    width: 1.5rem;
    height: 1.5rem;
  }

  .genre-name {
    font-size: 0.9rem;
  }

  .start-button {
    padding: 1rem 2rem;
    font-size: 1.2rem;
  }

  .random-button {
    font-size: 1rem;
  }
}

@media (max-height: 700px) {
  .hero-section {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }

  .neon-text {
    font-size: 1.6rem;
  }

  .genres-title {
    margin-bottom: 1rem;
  }

  .genres-container {
    gap: 0.8rem;
  }

  .genre-button {
    padding: 0.6rem;
    min-height: 90px;
  }

  .cta-section {
    gap: 0.8rem;
    margin-top: 1rem;
  }

  .start-button {
    padding: 0.8rem 1.5rem;
  }
}

@media (max-height: 600px) {
  .main-content {
    padding-top: 50px;
  }

  .theater-container {
    min-height: calc(100vh - 50px);
    padding: 0.5rem;
  }

  .genres-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }

  .hero-section {
    margin-top: 0.25rem;
    margin-bottom: 0.75rem;
  }

  .neon-text {
    font-size: 1.4rem;
  }

  .genre-button {
    min-height: 80px;
  }

  .start-button {
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
  }
}

@media (max-width: 400px) {
  .genres-container {
    grid-template-columns: 1fr;
  }
}
</style>