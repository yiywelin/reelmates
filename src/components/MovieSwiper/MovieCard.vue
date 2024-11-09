<template>
  <div 
    class="movie-card"
    :class="{
      'dragging': isDragging && index === 0,
      'exit-left': exitDirection === 'left' && index === 0,
      'exit-right': exitDirection === 'right' && index === 0
    }"
    :style="cardStyle"
    @mousedown="index === 0 ? startDrag($event) : undefined"
    @mousemove="index === 0 ? onDrag($event) : undefined"
    @mouseup="index === 0 ? endDrag() : undefined"
    @mouseleave="index === 0 ? endDrag() : undefined"
    @touchstart="index === 0 ? startTouchDrag($event) : undefined"
    @touchmove.prevent="index === 0 ? onTouchDrag($event) : undefined"
    @touchend="index === 0 ? endDrag() : undefined"
  >
    <!-- Holographic Overlay -->
    <div class="holographic-overlay"></div>
    
    <!-- Movie Content -->
    <div class="card-content">
      <transition name="fade">
        <div v-if="showOverview" class="movie-overview-overlay">
          <div class="movie-overview-content">
            <div class="overview-header">
              <h3 class="overview-title" :style="{ color: getPrimaryGenreColors.primary }">
                About this movie
              </h3>
              <button 
                @click="closeOverview"
                class="close-button"
                :style="{ 
                  '--hover-color': getPrimaryGenreColors.background,
                  color: getPrimaryGenreColors.primary 
                }"
              >
                ×
              </button>
            </div>
            <p class="movie-overview">{{ movie.overview }}</p>
            <div class="genre-tags" v-if="movie.genre_ids">
              <span 
                v-for="genreId in movie.genre_ids.slice(0, 3)" 
                :key="genreId"
                class="genre-tag"
                :style="getGenreStyle(genreId)"
              >
                {{ getGenreName(genreId) }}
              </span>
            </div>
          </div>
        </div>
      </transition>

      <div class="movie-poster-container" :class="{ 'blur-background': showOverview }">
        <img 
          :src="movie.posterPath || '/default-movie-poster.jpg'" 
          :alt="movie.title"
          class="movie-poster"
          draggable="false"
        />
        <div class="poster-overlay"></div>
      </div>

      <div class="movie-info">
        <div class="movie-header">
          <div>
            <h2 
              class="movie-title"
              :style="{
                background: `linear-gradient(45deg, ${getPrimaryGenreColors.primary}, ${adjustColorBrightness(getPrimaryGenreColors.primary, 20)})`,
                '-webkit-background-clip': 'text',
                '-webkit-text-fill-color': 'transparent'
              }"
            >
              {{ movie.title }}
            </h2>
            <p class="movie-year">{{ releaseYear }}</p>
          </div>
          <button 
            @click.stop="toggleOverview"
            class="info-button"
            :class="{ 'active': showOverview }"
            :style="{
              '--active-bg': getPrimaryGenreColors.primary,
              '--hover-bg': getPrimaryGenreColors.background
            }"
          >
            <span class="info-icon">ⓘ</span>
          </button>
        </div>

        <div class="movie-rating">
          <div class="rating-stars">
            <div 
              class="filled-stars"
              :style="{ 
                width: `${ratingPercentage}%`,
                color: getPrimaryGenreColors.primary 
              }"
            >
              ★★★★★
            </div>
            <div class="empty-stars">★★★★★</div>
          </div>
          <span class="rating-number" :style="{ color: getPrimaryGenreColors.primary }">{{ formattedRating }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'

const props = defineProps({
  movie: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  },
  exitDirection: {
    type: String,
    default: null
  }
})

const GENRE_COLORS = {
  action: {
    primary: '#FFD700',      // Gold
    background: 'rgba(255, 215, 0, 0.2)',
    glow: 'rgba(255, 215, 0, 0.5)'
  },
  scifi: {
    primary: '#4DB5FF',      // Bright blue
    background: 'rgba(77, 181, 255, 0.2)',
    glow: 'rgba(77, 181, 255, 0.5)'
  },
  romance: {
    primary: '#FF69B4',      // Pink
    background: 'rgba(255, 105, 180, 0.2)',
    glow: 'rgba(255, 105, 180, 0.5)'
  },
  thriller: {
    primary: '#FF4444',      // Red
    background: 'rgba(255, 68, 68, 0.2)',
    glow: 'rgba(255, 68, 68, 0.5)'
  },
  comedy: {
    primary: '#FFA500',      // Orange
    background: 'rgba(255, 165, 0, 0.2)',
    glow: 'rgba(255, 165, 0, 0.5)'
  },
  drama: {
    primary: '#9370DB',      // Purple
    background: 'rgba(147, 112, 219, 0.2)',
    glow: 'rgba(147, 112, 219, 0.5)'
  },
  fantasy: {
    primary: '#BA55D3',      // Medium orchid
    background: 'rgba(186, 85, 211, 0.2)',
    glow: 'rgba(186, 85, 211, 0.5)'
  },
  horror: {
    primary: '#8B0000',      // Dark red
    background: 'rgba(139, 0, 0, 0.2)',
    glow: 'rgba(139, 0, 0, 0.5)'
  },
  animation: {
    primary: '#00FF7F',      // Spring green
    background: 'rgba(0, 255, 127, 0.2)',
    glow: 'rgba(0, 255, 127, 0.5)'
  },
  default: {
    primary: '#4facfe',      // Default blue
    background: 'rgba(79, 172, 254, 0.2)',
    glow: 'rgba(79, 172, 254, 0.5)'
  }
}

// Add a function to get the primary genre color scheme
const getPrimaryGenreColors = computed(() => {
  if (!props.movie.genre_ids?.length) return GENRE_COLORS.default
  
  const primaryGenreId = props.movie.genre_ids[0]
  const genreName = getGenreName(primaryGenreId).toLowerCase()
  return GENRE_COLORS[genreName] || GENRE_COLORS.default
})

// Update your getGenreStyle function
const getGenreStyle = (genreId) => {
  const genreName = getGenreName(genreId).toLowerCase()
  const colors = GENRE_COLORS[genreName] || GENRE_COLORS.default
  
  return {
    background: colors.background,
    color: colors.primary,
    borderColor: `${colors.primary}40` // 40 is hex for 25% opacity
  }
}

const emit = defineEmits(['swipe', 'dragging'])

const showOverview = ref(false)

// Genre mapping (you can expand this list)
const genres = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
}

const getGenreName = (genreId) => genres[genreId] || 'Unknown'

const toggleOverview = () => {
  showOverview.value = !showOverview.value
}

const closeOverview = () => {
  showOverview.value = false
}


// Computed properties for movie data
const releaseYear = computed(() => {
  return props.movie.releaseDate ? new Date(props.movie.releaseDate).getFullYear() : 'N/A'
})

const ratingPercentage = computed(() => {
  return (props.movie.rating / 10) * 100
})

const formattedRating = computed(() => {
  return props.movie.rating ? props.movie.rating.toFixed(2) : 'N/A'
})

// Drag state
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)

// Computed styles
const cardStyle = computed(() => {
  const isCurrentCard = props.index === 0
  const isNextCard = props.index === 1
  const isThirdCard = props.index === 2

  // Handle exit animations
  if (props.exitDirection && isCurrentCard) {
    const translateX = props.exitDirection === 'right' ? 1000 : -1000
    return {
      transform: `translateX(${translateX}px) rotate(${translateX * 0.1}deg)`,
      transition: 'transform 0.3s ease',
      opacity: 0,
      zIndex: 3
    }
  }

  // Handle dragging
  if (isDragging.value && isCurrentCard) {
    const rotate = currentX.value * 0.1
    return {
      transform: `translateX(${currentX.value}px) rotate(${rotate}deg)`,
      transition: 'none',
      zIndex: 3
    }
  }

  // Handle stacking
  if (isCurrentCard) {
    return {
      transform: 'translate(0, 0) rotate(0deg)',
      opacity: 1,
      zIndex: 3
    }
  } else if (isNextCard) {
    return {
      transform: 'translate(0, 4px) scale(0.95)',
      opacity: 0.8,
      zIndex: 2
    }
  } else if (isThirdCard) {
    return {
      transform: 'translate(0, 8px) scale(0.9)',
      opacity: 0.6,
      zIndex: 1
    }
  }

  return {
    transform: 'translate(0, 12px) scale(0.85)',
    opacity: 0.4,
    zIndex: 0
  }
})

// Drag handlers
const startDrag = (event) => {
  isDragging.value = true
  startX.value = event.clientX - currentX.value
}

const onDrag = (event) => {
  if (!isDragging.value) return
  currentX.value = event.clientX - startX.value
  emit('dragging', currentX.value)
}

const startTouchDrag = (event) => {
  isDragging.value = true
  startX.value = event.touches[0].clientX - currentX.value
}

const onTouchDrag = (event) => {
  if (!isDragging.value) return
  currentX.value = event.touches[0].clientX - startX.value
  emit('dragging', currentX.value)
}

const endDrag = () => {
  if (!isDragging.value) return
  isDragging.value = false
  
  const threshold = 100
  if (Math.abs(currentX.value) > threshold) {
    emit('swipe', currentX.value > 0 ? 'right' : 'left')
  }
  currentX.value = 0
}

// Add this utility function to adjust color brightness
const adjustColorBrightness = (hex, percent) => {
  // Convert hex to RGB
  let r = parseInt(hex.slice(1, 3), 16)
  let g = parseInt(hex.slice(3, 5), 16)
  let b = parseInt(hex.slice(5, 7), 16)

  // Increase brightness
  r = Math.min(255, r + (255 - r) * (percent / 100))
  g = Math.min(255, g + (255 - g) * (percent / 100))
  b = Math.min(255, b + (255 - b) * (percent / 100))

  // Convert back to hex
  const rr = Math.round(r).toString(16).padStart(2, '0')
  const gg = Math.round(g).toString(16).padStart(2, '0')
  const bb = Math.round(b).toString(16).padStart(2, '0')

  return `#${rr}${gg}${bb}`
}

</script>

<style scoped>
.movie-card {
  position: absolute;
  left: 0;
  width: 340px;
  height: 500px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  cursor: grab;
  user-select: none;
  transform-origin: 50% 100%;
  will-change: transform;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.movie-poster-container {
  position: relative;
  height: 75%;
  overflow: hidden;
  transition: filter 0.3s ease;
}

.blur-background {
  filter: blur(3px) brightness(0.7);
}

.movie-overview-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 10;
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
}

.movie-card.dragging {
  cursor: grabbing;
  transition: none;
}

.holographic-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent,
    rgba(77, 181, 255, 0.1),
    transparent
  );
  animation: holographic 3s linear infinite;
}

.card-content {
  height: 100%;
  position: relative;
  z-index: 1;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.poster-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.movie-info {
  padding: 1rem;
  background: rgba(0, 0, 0, 0.7);
  height: 25%;
  position: relative;
}

.movie-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.movie-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  transition: all 0.3s ease;
}

.movie-year {
  color: #a0aec0;
  font-size: 0.9rem;
}

.info-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.info-button:hover {
  background: var(--hover-bg);
}

.info-button.active {
  background: var(--active-bg);
  color: white;
}

.info-icon {
  font-size: 1.2rem;
  color: #fff;
}

.movie-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  position: relative;
  display: inline-block;
  font-size: 1.2rem;
}

.filled-stars {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.empty-stars {
  color: rgba(255, 255, 255, 0.2);
}

.rating-number {
  font-weight: bold;
  transition: color 0.3s ease;
}

.movie-overview-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  z-index: 10;
}

.movie-overview-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.movie-overview-content::-webkit-scrollbar {
  width: 8px;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.overview-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  padding: 0.25rem;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: var(--hover-color);
  transform: scale(1.1);
}

.genre-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.8rem;
  backdrop-filter: blur(4px);
  border: 1px solid;
  transition: all 0.3s ease;
}

.genre-tag:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}


.close-button:active {
  transform: scale(0.95);
}

.movie-overview {
  flex: 1;
  color: #e2e8f0;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  overflow-y: auto;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes holographic {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.exit-left {
  animation: exitLeft 0.3s ease forwards;
}

.exit-right {
  animation: exitRight 0.3s ease forwards;
}

@keyframes exitLeft {
  to {
    transform: translate(-200%, 0) rotate(-20deg);
    opacity: 0;
  }
}

@keyframes exitRight {
  to {
    transform: translate(200%, 0) rotate(20deg);
    opacity: 0;
  }
}
</style>