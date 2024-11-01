<template>
  <div class="swiper-container">
    <SciFiBackground />
    
    <!-- Loading State -->
    <div v-if="loading" class="text-white text-xl">
      Loading movies...
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-xl">
      {{ error }}
      <button @click="loadMovies" class="mt-4 px-4 py-2 bg-blue-500 rounded">
        Retry
      </button>
    </div>
    
    <!-- Content -->
    <template v-else>
      <div class="flex flex-col items-center justify-center flex-grow">
        <div class="card-stack-container">
          <div class="card-stack">
            <MovieCard
              v-for="(movie, index) in displayedMovies"
              :key="movie.id"
              :movie="movie"
              :index="index"
              :exit-direction="exitDirection"
              @swipe="handleSwipe"
            />
          </div>
        </div>

        <div class="controls-container">
          <div class="text-center">
            <p v-if="currentIndex >= movies.length" class="text-xl text-white">
              {{ isLoadingMore ? 'Loading more movies...' : 'No more movies to swipe!' }}
            </p>
            <p v-else class="text-xl text-white">
              {{ swipeMessage }}
            </p>
          </div>

          <div v-if="currentIndex < movies.length" class="flex gap-4 justify-center mt-4">
            <button
              @click="handleManualSwipe('left')"
              class="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              Pass
            </button>
            <button
              @click="handleManualSwipe('right')"
              class="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
            >
              Like
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import MovieCard from './MovieCard.vue'
import SciFiBackground from './backgrounds/SciFiBackground.vue'
import tmdbService from '../../services/tmdbService'

const auth = getAuth()
const currentIndex = ref(0)
const movies = ref([])
const likedMovies = ref([])
const exitDirection = ref(null)
const error = ref(null)
const loading = ref(true)
const currentPage = ref(1)
const isLoadingMore = ref(false)

// Show 3 cards at a time
const displayedMovies = computed(() => {
  return movies.value.slice(currentIndex.value, currentIndex.value + 3)
})

const swipeMessage = computed(() => {
  return "Swipe right to like, left to pass"
})

// Load movies from TMDB
const loadMovies = async (page = 1) => {
  try {
    loading.value = true
    error.value = null
    const fetchedMovies = await tmdbService.getPopularMovies(page)
    
    if (page === 1) {
      movies.value = fetchedMovies
    } else {
      movies.value = [...movies.value, ...fetchedMovies]
    }
  } catch (err) {
    error.value = 'Failed to load movies. Please try again.'
    console.error('Error loading movies:', err)
  } finally {
    loading.value = false
  }
}

// Load more movies when running low
const checkAndLoadMore = async () => {
  const remainingMovies = movies.value.length - currentIndex.value
  
  if (remainingMovies <= 5 && !isLoadingMore.value) {
    isLoadingMore.value = true
    currentPage.value++
    await loadMovies(currentPage.value)
    isLoadingMore.value = false
  }
}

// Load user's liked movies from Firestore
const loadLikedMovies = async () => {
  if (!auth.currentUser) return
  
  try {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      likedMovies.value = userData.likedMovies || []
    }
  } catch (err) {
    console.error('Error loading liked movies:', err)
    error.value = 'Failed to load liked movies'
  }
}

// Record swipe in Firestore
const recordSwipe = async (movie, isLike) => {
  if (!auth.currentUser) return
  
  try {
    const userRef = doc(db, 'users', auth.currentUser.uid)
    const swipeData = {
      movieId: movie.id,
      title: movie.title,
      rating: movie.rating,
      posterPath: movie.posterPath,
      swipedAt: new Date().toISOString()
    }

    await updateDoc(userRef, {
      swipedMovies: arrayUnion({
        ...swipeData,
        isLike
      })
    })

    if (isLike) {
      await updateDoc(userRef, {
        likedMovies: arrayUnion(swipeData)
      })
    }
  } catch (err) {
    console.error('Error recording swipe:', err)
    error.value = 'Failed to record swipe'
  }
}

const handleSwipe = async (direction) => {
  exitDirection.value = direction
  const currentMovie = movies.value[currentIndex.value]
  
  if (direction === 'right') {
    likedMovies.value.push(currentMovie)
    await recordSwipe(currentMovie, true)
  } else {
    await recordSwipe(currentMovie, false)
  }
  
  setTimeout(() => {
    currentIndex.value++
    exitDirection.value = null
    checkAndLoadMore()
  }, 300)
}

const handleManualSwipe = (direction) => {
  handleSwipe(direction)
}

// Watch for changes in currentIndex to load more movies
watch(currentIndex, () => {
  checkAndLoadMore()
})

// Load initial data when component mounts
onMounted(async () => {
  await Promise.all([
    loadMovies(),
    loadLikedMovies()
  ])
})
</script>

<style scoped>
.swiper-container {
  position: relative;
  height: 100vh; /* Full viewport height */
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Center vertically */
  align-items: center;
  padding: 2rem;
}

.card-stack-container {
  /* Remove flex: 1 as it's causing the container to stretch */
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem; /* Add space between card and controls */
}

.card-stack {
  position: relative;
  width: 340px;
  height: 500px;
}

.controls-container {
  width: 100%;
  max-width: 2xl;
  text-align: center;
}

/* Keep your existing animation keyframes */
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