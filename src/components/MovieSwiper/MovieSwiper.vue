<template>
  <div class="swiper-container">
    <!-- Back Button -->
    <div class="absolute top-4 left-4 z-50">
      <button 
        @click="$router.push('/home')"
        class="relative w-12 h-12 flex items-center justify-center"
      >
        <!-- Outer glow ring - corrected to match your X button style -->
        <div class="absolute inset-0 rounded-full border border-[#DB3DCF] hover:border-[#DB3DCF] hover:shadow-[0_0_10px_#DB3DCF] transition-all duration-300"></div>
        
        <!-- Arrow icon -->
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          class="w-6 h-6 text-[#DB3DCF]" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            stroke-linecap="round" 
            stroke-linejoin="round" 
            stroke-width="2" 
            d="M15 19l-7-7 7-7" 
          />
        </svg>
      </button>
    </div>

    <div class="background-container">
      <!-- Current background -->
      <transition name="fade">
        <component 
          :is="getBackgroundComponent"
          v-if="getBackgroundComponent"
          :key="displayedMovies[0]?.id"
          class="background-element"
        />
      </transition>

      <!-- Preload next background (hidden) -->
      <div style="display: none;">
        <component 
          :is="getNextBackgroundComponent"
          v-if="getNextBackgroundComponent"
          :key="'next-' + (displayedMovies[1]?.id || '')"
        />
      </div>
    </div>

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
      <div class="flex flex-col items-center justify-center flex-grow pointer-events-none" style="z-index: 1;">
        <div class="card-stack-container pointer-events-auto">
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

        <div class="controls-container pointer-events-auto">
          <div v-if="currentIndex < movies.length" class="button-container">
            <button
              @click="handleManualSwipe('left')"
              class="action-button pass-button"
              aria-label="Pass"
            >
              <div class="icon">✕</div>
            </button>
            <button
              @click="handleManualSwipe('right')"
              class="action-button like-button"
              aria-label="Like"
            >
              <div class="icon">♥</div>
            </button>
          </div>
        </div>

        <!-- Add the Match Overlay -->
        <MatchOverlay
          v-if="showMatchOverlay"
          :matches="matchedUsers"
          @close="closeMatchOverlay"
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../../firebaseConfig'
import { useRoute } from 'vue-router'
import MovieCard from './MovieCard.vue'
import SciFiBackground from './backgrounds/SciFiBackground.vue'
import RomanceBackground from './backgrounds/RomanceBackground.vue'
import ActionBackground from './backgrounds/ActionBackground.vue'
import ThrillerBackground from './backgrounds/ThrillerBackground.vue'
import DramaBackground from './backgrounds/DramaBackground.vue'
import AnimationBackground from './backgrounds/AnimationBackground.vue'
import ComedyBackground from './backgrounds/ComedyBackground.vue'
import AdventureBackground from './backgrounds/AdventureBackground.vue'
import FantasyBackground from './backgrounds/FantasyBackground.vue'
import CrimeBackground from './backgrounds/CrimeBackground.vue'
import CinematicBackground from '../Backgrounds/CinematicBackground.vue'
import tmdbService from '../../services/tmdbService'
import MatchOverlay from './MatchOverlay.vue'

const GENRE_MAP = {
  28: 'action',      // Action
  35: 'comedy',      // Comedy
  18: 'drama',       // Drama
  12: 'adventure',   // Adventure
  878: 'scifi',      // Science Fiction
  14: 'fantasy',     // Fantasy
  53: 'thriller',    // Thriller
  10749: 'romance',  // Romance
  80: 'crime',       // Crime
  16: 'animation'    // Animation
}

const auth = getAuth()
const currentIndex = ref(0)
const movies = ref([])
const likedMovies = ref([])
const exitDirection = ref(null)
const error = ref(null)
const loading = ref(true)
const currentPage = ref(1)
const isLoadingMore = ref(false)
const route = useRoute()
const swipedMovieIds = ref(new Set())
const showMatchOverlay = ref(false)
const matchedUsers = ref([])

const BACKGROUND_MAP = {
    action: ActionBackground,
    comedy: ComedyBackground,
    drama: DramaBackground,
    adventure: AdventureBackground,
    scifi: SciFiBackground,
    fantasy: FantasyBackground,
    thriller: ThrillerBackground,
    romance: RomanceBackground,
    crime: CrimeBackground,
    animation: AnimationBackground
}

// Determine which background to show based on genres
// Update getBackgroundComponent with null checks and debugging
const getBackgroundComponent = computed(() => {
  // Check if we have movies to display
  if (!displayedMovies.value?.length) {
    console.log('No movies to display, using default background');
    return CinematicBackground;
  }

  const currentMovie = displayedMovies.value[0];
  if (!currentMovie) {
    console.log('No current movie, using default background');
    return CinematicBackground;
  }

  console.log('Current movie:', currentMovie.title);
  console.log('Full movie object:', currentMovie);

  // Check if genre_ids exists
  if (!currentMovie.genre_ids || !Array.isArray(currentMovie.genre_ids)) {
    console.log('No genre_ids found for movie:', currentMovie);
    return CinematicBackground;
  }

  // Convert genre_ids to genre names
  const movieGenres = currentMovie.genre_ids
    .map(id => GENRE_MAP[id])
    .filter(Boolean); // Remove any undefined genres
  
  console.log('Movie genres in order:', movieGenres);

  // Find first genre with a matching background
  const firstMatchingGenre = movieGenres.find(genre => BACKGROUND_MAP[genre]);
  console.log('Selected background genre:', firstMatchingGenre);

  return BACKGROUND_MAP[firstMatchingGenre] || CinematicBackground;
})

  // computed property for next background
  const getNextBackgroundComponent = computed(() => {
  if (!displayedMovies.value?.[1]) return null
  
  const nextMovie = displayedMovies.value[1]
  const nextGenres = nextMovie.genre_ids
    .map(id => GENRE_MAP[id])
    .filter(Boolean)
  
  const nextGenre = nextGenres.find(genre => BACKGROUND_MAP[genre])
  return BACKGROUND_MAP[nextGenre] || CinematicBackground
})

// Get genres from route query
const selectedGenres = computed(() => {
  const genresParam = route?.query?.genres
  return genresParam ? genresParam.split(',') : []
})

// Show 3 cards at a time
const displayedMovies = computed(() => {
  return movies.value.slice(currentIndex.value, currentIndex.value + 3)
})

// Load movies from TMDB
const loadMovies = async (page = 1) => {
  try {
    loading.value = true
    error.value = null

    await loadUserMovieHistory()
    console.log('Loaded swiped movies before fetching:', Array.from(swipedMovieIds.value))
    
    const fetchedMovies = await tmdbService.getMoviesByGenres(selectedGenres.value, page)
    console.log('Fetched movies:', fetchedMovies);

    const swipedIds = new Set(Array.from(swipedMovieIds.value).map(String))
    
    // Filter out movies that have already been swiped
    const newMovies = fetchedMovies.filter(movie => {
      const movieId = String(movie.id)
      const isSwiped = swipedIds.has(movieId)
      return !isSwiped
    })
    
    console.log('Movies after filtering:', newMovies.map(m => ({id: m.id, title: m.title})))
    
    // If we filtered out too many movies, fetch more
    if (newMovies.length < 10 && fetchedMovies.length > 0) {
      const nextPageMovies = await loadMovies(page + 1)
      newMovies.push(...nextPageMovies)
    }
    
    if (newMovies.length === 0) {
      if (page === 1) {
        error.value = 'No new movies found for selected genres. Try different genres!'
        movies.value = []
      }
      return []
    }  
    
    if (page === 1) {
      movies.value = newMovies
    } else {
      movies.value = [...movies.value, ...newMovies]
    }
    return newMovies
  } catch (err) {
    console.error('Error loading movies:', err)
    error.value = 'Failed to load movies. Please try again.'
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

// Load user's swiped movies from Firestore
const loadUserMovieHistory = async () => {
  if (!auth.currentUser) return
  
  try {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      likedMovies.value = userData.likedMovies || []
      
      // Get all swiped movie IDs (both likes and passes)
      const swipedMovies = userData.swipedMovies || []
      swipedMovieIds.value = new Set(swipedMovies.map(movie => movie.movieId))
    }
  } catch (err) {
    console.error('Error loading movie history:', err)
    error.value = 'Failed to load movie history'
  }
}

// Check movie matches with friends
const checkMovieMatches = async (movieId) => {
  if (!auth.currentUser) return []
  
  try {
    // Get current user's friends
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
    const userData = userDoc.data()
    const friendIds = userData.friends || []
    
    // Get all friends' liked movies
    const matches = []
    
    // Check each friend's liked movies
    await Promise.all(friendIds.map(async (friendId) => {
      const friendDoc = await getDoc(doc(db, 'users', friendId))
      if (friendDoc.exists()) {
        const friendData = friendDoc.data()
        const friendLikedMovies = friendData.likedMovies || []
        
        // Check if friend liked this movie
        const matchedMovie = friendLikedMovies.find(movie => String(movie.movieId) === String(movieId))
        
        if (matchedMovie) {
          matches.push({
            friendId,
            friendEmail: friendData.email,
            movieId,
            movieTitle: matchedMovie.title,
            matchedAt: new Date().toISOString()
          })
        }
      }
    }))
    
    return matches
  } catch (error) {
    console.error('Error checking movie matches:', error)
    return []
  }
}

// get all movie matches for the current user
// const getMatches = async () => {
//   if (!auth.currentUser) return []
  
//   try {
//     const matchesSnapshot = await getDocs(collection(db, 'users', auth.currentUser.uid, 'matches'))
//     return matchesSnapshot.docs.map(doc => doc.data())
//   } catch (error) {
//     console.error('Error getting matches:', error)
//     return []
//   }
// }

// Record swipe in Firestore
const recordSwipe = async (movie, isLike) => {
  if (!auth.currentUser) return
  
  try {
    console.log(`Recording swipe for movie ${movie.id} (${movie.title})`, isLike ? 'like' : 'pass')
    const userRef = doc(db, 'users', auth.currentUser.uid)
    const swipeData = {
      movieId: movie.id,
      title: movie.title,
      rating: movie.rating,
      posterPath: movie.posterPath,
      swipedAt: new Date().toISOString()
    }

    swipedMovieIds.value.add(movie.id)
    console.log('Updated swiped movies set:', Array.from(swipedMovieIds.value))

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

      // Check for matches when liking a movie
      const matches = await checkMovieMatches(movie.id)
      
      if (matches.length > 0) {
        // Store matches in Firestore
        await Promise.all(matches.map(async (match) => {
          // Create a matches collection for the current user
          const matchRef = doc(db, 'users', auth.currentUser.uid, 'matches', `${match.friendId}-${match.movieId}`)
          await setDoc(matchRef, match)
          
          // Create a matches collection for the friend
          const friendMatchRef = doc(db, 'users', match.friendId, 'matches', `${auth.currentUser.uid}-${match.movieId}`)
          await setDoc(friendMatchRef, {
            ...match,
            friendId: auth.currentUser.uid,
            friendEmail: auth.currentUser.email
          })
          
          // Show match notification
          // You can implement this based on your UI needs
          console.log(`Matched with ${match.friendEmail} on ${match.movieTitle}!`)
        }))
      }
    }
  } catch (err) {
    console.error('Error recording swipe:', err)
    error.value = 'Failed to record swipe'
  }
}

const closeMatchOverlay = () => {
  showMatchOverlay.value = false
  matchedUsers.value = []
}

const handleSwipe = async (direction) => {
  exitDirection.value = direction
  const currentMovie = movies.value[currentIndex.value]
  
  if (direction === 'right') {
    likedMovies.value.push(currentMovie)
    await recordSwipe(currentMovie, true)

    // Check for matches
    const matches = await checkMovieMatches(currentMovie.id)
    if (matches.length > 0) {
      matchedUsers.value = matches.map(match => ({
        friendEmail: match.friendEmail,
        movieTitle: currentMovie.title
      }))
      showMatchOverlay.value = true
    }
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
watch(selectedGenres, async (newGenres) => {
  if (newGenres.length > 0) {
    currentIndex.value = 0
    currentPage.value = 1
    await loadMovies()
  }
})

onMounted(async () => {
  try {
    await Promise.all([
      loadUserMovieHistory(),
      loadMovies()
    ])
  } catch (err) {
    console.error('Error loading initial data:', err)
    error.value = 'Failed to load initial data. Please try again.'
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.background-element {
  position: absolute;
  inset: 0;
  pointer-events: auto;
}

.swiper-container {
  position: relative;
  height: 100vh;
  width: 100%;
  background: #0a0a1f;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.background-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: auto;
}

.card-stack-container {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  z-index: 2;
}

.card-stack {
  position: relative;
  width: 340px;
  height: 500px;
  z-index: 2;
}

.controls-container {
  width: 100%;
  max-width: 2xl;
  text-align: center;
  margin-bottom: 2rem;
  z-index: 2;
}

.text-white,
.text-red-500 {
  position: relative;
  z-index: 2;
}

.button-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  margin-top: 1rem;
}

.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  cursor: pointer;
  background: rgba(10, 10, 31, 0.8); /* Dark background matching app theme */
}

.icon-size {
  width: 24px;
  height: 24px;
}

.pass-button {
  border-color: #DB3DCF; /* Pink neon border */
  color: #DB3DCF; /* Pink neon icon */
  box-shadow: 0 0 10px rgba(219, 61, 207, 0.3); /* Subtle neon glow */
}

.pass-button:hover {
  background: rgba(219, 61, 207, 0.2);
  box-shadow: 0 0 20px rgba(219, 61, 207, 0.5);
  transform: scale(1.1);
}

.like-button {
  border-color: #675FF2; /* Purple neon border */
  color: #675FF2; /* Purple neon icon */
  box-shadow: 0 0 10px rgba(103, 95, 242, 0.3); /* Subtle neon glow */
}

.like-button:hover {
  background: rgba(103, 95, 242, 0.2);
  box-shadow: 0 0 20px rgba(103, 95, 242, 0.5);
  transform: scale(1.1);
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