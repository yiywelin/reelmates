<template>
  <div class="h-screen bg-[#0A0A1F] flex flex-col overflow-hidden">
    <div class="h-[70px] flex-shrink-0">
      <NavBar />
    </div> 
    
    <div class="flex-1 relative overflow-hidden">
      <div class="h-full flex flex-col items-center p-2 sm:p-4 md:p-8 text-[#D0CCE3] z-10">
        <TheatricalBackground />
        
        <div class="absolute top-2 sm:top-4 left-2 sm:left-4 z-50">
          <button 
            @click="$router.back()"
            class="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center"
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

        <!-- Header -->
        <div class="text-center mb-4 sm:mb-8 animate-fadeIn">
          <span class="text-2xl sm:text-[2rem] lg:text-[2.5rem] mb-2 text-[#DB3DCF] 
            [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF] 
            animate-neonFlicker">
            {{ 'Recommended Movies' }}
          </span>
        </div>

        <div class="text-center mb-4 sm:mb-8 animate-fadeIn">
          <button 
            @click="handleRoulettePage"
            class="text-lg sm:text-xl md:text-3xl lg:text-4xl font-semibold text-[#D0CCE3] animate-neonFlicker 
              [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF]">
            I'm feeling lucky
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6961]"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="flex-1 flex flex-col items-center justify-center">
          <div class="text-[#FF6961] text-lg mb-4">{{ error }}</div>
          <button 
            @click="loadMovies"
            class="px-6 py-3 bg-[#675FF2] text-white rounded-lg hover:bg-[#7B74FF] 
              transition-all duration-300 hover:-translate-y-0.5">
            Try Again
          </button>
        </div>

        <!-- Movie Carousel -->
        <div v-else-if="movies.length" class="flex-1 w-full max-w-[1600px] relative flex items-center">
          <!-- Previous Button -->
          <button 
            class="absolute left-0 sm:left-2 md:left-8 z-10 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 rounded-full
              bg-[rgba(103,95,242,0.1)] backdrop-blur-md text-white cursor-pointer transition-all
              duration-300 disabled:opacity-0 disabled:cursor-default
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

          <!-- Movie Cards Container -->
          <div 
            class="h-full w-full overflow-hidden px-2 sm:px-4 md:px-16"
            @touchstart="handleTouchStart"
            @touchmove="handleTouchMove"
            @touchend="handleTouchEnd"
            ref="carouselRef"
          >
            <div 
              class="h-full flex items-center"
              :style="{ 
                transform: `translateX(-${currentIndex * (100 / visibleMovies)}%)`,
                transition: isAnimating ? 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
              }"
            >
              <!-- Movie Cards -->
              <div 
                v-for="movie in movies" 
                :key="movie.id"
                :style="{ flex: `0 0 ${100 / visibleMovies}%` }"
                class="h-[85%] px-2 sm:px-4 md:px-6 lg:px-8"
              >
                <!-- Movie Card Content -->
                <div 
                  class="h-full relative rounded-2xl cursor-pointer overflow-hidden
                    transition-transform duration-300 ease-in-out hover:-translate-y-3 group"
                  @click="navigateToWatchParty()"
                  @mouseenter="loadTrailer(movie)"
                  @mouseleave="closeTrailer"
                >
                  <!-- Movie Poster and Content -->
                  <img 
                    :src="movie.posterPath 
                      ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                      : '/placeholder-movie.jpg'"
                    :alt="movie.title"
                    class="absolute inset-0 w-full h-full object-cover rounded-2xl
                      transition-all duration-300 group-hover:scale-135"
                  />
                  <!-- Trailer Overlay -->
                  <div 
                    v-if="currentTrailer && currentTrailer.id === movie.id" 
                    class="absolute inset-0 bg-black bg-opacity-75 rounded-2xl overflow-hidden"
                  >
                    <div class="absolute inset-0 flex items-center justify-center">
                      <iframe 
                        :src="`https://www.youtube.com/embed/${currentTrailer.key}?autoplay=1`" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                        class="w-[95%] aspect-video"
                      ></iframe>
                    </div>
                  </div>

                  <!-- Movie Info Overlay -->
                  <div class="absolute inset-x-0 bottom-0 p-3 sm:p-6 bg-gradient-to-t 
                  from-[rgba(10,10,31,0.95)] via-[rgba(10,10,31,0.7)] to-transparent 
                  rounded-b-2xl translate-y-full transition-transform duration-300 
                  group-hover:translate-y-0">
                    <h3 class="text-base sm:text-lg md:text-xl font-semibold text-white 
                      [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]">
                      {{ movie.title }}
                    </h3>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-yellow-400">★</span>
                      <span class="text-white">{{ movie.voteAverage?.toFixed(1) + '/10' || 'N/A' }}</span>
                      <span v-if="movie.basedOn" class="text-sm font-semibold text-gray-400">
                        (Similar to {{ movie.basedOn }})
                      </span>
                    </div>
                    <div class="mt-2 sm:mt-3 opacity-0 translate-y-5 transition-all duration-300 
                    group-hover:opacity-100 group-hover:translate-y-0">
                      <button 
                        @click.stop="navigateToWatchParty()"
                        class="inline-block px-3 sm:px-4 py-1 sm:py-2 bg-[#675FF2] text-white 
                          rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 
                          hover:bg-[#7B74FF] hover:-translate-y-0.5">
                        Start watch party
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Next Button -->
          <button 
            class="absolute right-0 sm:right-2 md:right-8 z-10 w-8 sm:w-12 md:w-16 h-8 sm:h-12 md:h-16 rounded-full
              bg-[rgba(103,95,242,0.1)] backdrop-blur-md text-white cursor-pointer transition-all
              duration-300 disabled:opacity-0 disabled:cursor-default
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

        <!-- No Movies State -->
        <div v-else class="flex-1 flex items-center justify-center">
          <p class="text-lg text-[#D0CCE3]">No movies found. Try refreshing the page.</p>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter,useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'
import TheatricalBackground from '../components/Backgrounds/TheatricalBackground.vue'
import NavBar from '../components/ui/NavBar.vue'
const TMDB_API_KEY = "1d349c13bf966a4e71a6e01cbb3bbe78"
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

// State
const router = useRouter()
const route = useRoute()
const auth = getAuth()
const movies = ref([])
const loading = ref(true)
const error = ref(null)
const currentIndex = ref(0)
const isAnimating = ref(false)
const touchStart = ref(null)
const touchEnd = ref(null)
const carouselRef = ref(null)
const visibleMovies = ref(3)
const currentTrailer = ref(null)
const groupId = route.params.groupId
const chatId = route.params.chatId

// Carousel functionality
const updateVisibleMovies = () => {
  if (!carouselRef.value) return
  
  const width = window.innerWidth
  
  if (width < 480) {
    visibleMovies.value = 1
  } else if (width < 768) {
    visibleMovies.value = 1
  } else if (width < 1024) {
    visibleMovies.value = 2
  } else {
    visibleMovies.value = 3 
  }
  
  if (currentIndex.value > movies.value.length - visibleMovies.value) {
    currentIndex.value = Math.max(0, movies.value.length - visibleMovies.value)
  }
}

const next = () => {
  if (currentIndex.value < movies.value.length - visibleMovies.value) {
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


const handleRoulettePage = async () => {
  try {
    router.push({
      name: 'MovieRoulette',
      params: { groupId, chatId }
    })
  } catch (error) {
    console.error('Failed to go to MovieRoulette', error)
  }
}


const tmdbService = {
  async fetchFromTMDB(endpoint) {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}&api_key=${TMDB_API_KEY}`)
    if (!response.ok) throw new Error('Failed to fetch from TMDB')
    return response.json()
  },

  processMovie(movie, basedOnTitle = '') {
    return {
      id: movie.id,
      title: movie.title,
      posterPath: movie.poster_path,
      voteAverage: movie.vote_average,
      overview: movie.overview,
      basedOn: basedOnTitle
    }
  },

  async getMovieDetails(movieId) {
    const data = await this.fetchFromTMDB(`/movie/${movieId}?language=en-US`)
    return data
  },

  async getRecommendations(movieId) {
    const data = await this.fetchFromTMDB(`/movie/${movieId}/recommendations?language=en-US&page=1`)
    const sourceMovie = await this.getMovieDetails(movieId)
    return data.results.map(movie => this.processMovie(movie, sourceMovie.title))
  },

  async getPopularMovies() {
    const data = await this.fetchFromTMDB('/movie/popular?language=en-US&page=1')
    return data.results.map(movie => this.processMovie(movie))
  },

  async getMovieTrailer(movieId) {
    const data = await this.fetchFromTMDB(`/movie/${movieId}/videos?language=en-US`)
    return data.results.find(video => video.type === 'Trailer')
  }
}
async function fetchDocumentByKey(collectionName, documentKey) {
  try {  
    const docRef = doc(db, collectionName, documentKey);
    const docSnap = await getDoc(docRef);
    const userData = docSnap.data();
    console.log("fetched data:", userData);
    return userData;
  } catch (err) {
    console.error('Error fetching document:', err);
    return null;
  }
}


const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const loadMovies = async () => {
  try {
    loading.value = true;
    error.value = null;
    currentIndex.value = 0;
    const groupMembersMovieslst = [];

    // Fetch current user's liked movies
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    console.log("userDoc:", userDoc.data());
    let userLikedMovieslst = userDoc.data().likedMovies || [];
    
    // Process current user's liked movies
    let userLikedMoviesIdlst = userLikedMovieslst.map(movieobj => movieobj.movieId);
    if (userLikedMoviesIdlst.length > 0) {
      let userShuffledLikedMovies = shuffleArray([...userLikedMoviesIdlst]);
      let userNumberOfSources = Math.min(8, userShuffledLikedMovies.length);
      let userSelectedMovies = userShuffledLikedMovies.slice(0, userNumberOfSources);
      groupMembersMovieslst.push(...userSelectedMovies);
    }

    // Fetch group data
    const groupdb = await getDoc(doc(db, 'groups', groupId));
    const groupMembersId = groupdb.data().members || [];
    
    // Fetch all members' data in parallel
    const membersData = await Promise.all(
      groupMembersId.map(memberId => fetchDocumentByKey("users", memberId))
    );
    
    // Process each member's liked movies
    membersData.forEach(memberObj => {
      if (memberObj.likedMovies.length > 0) {
        const likedMoviesIdlst = memberObj.likedMovies.map(movieobj => movieobj.movieId);
        const shuffledLikedMovies = shuffleArray([...likedMoviesIdlst]);
        const numberOfSources = Math.min(4, shuffledLikedMovies.length);
        const selectedMovies = shuffledLikedMovies.slice(0, numberOfSources);
        groupMembersMovieslst.push(...selectedMovies);
      }
    });

    // Handle case when no liked movies are found
    if (groupMembersMovieslst.length === 0) {
      const popularMovies = await tmdbService.getPopularMovies();
      movies.value = popularMovies;
      return;
    }

    // Process recommendations
    const shuffledLikedMovies = shuffleArray([...groupMembersMovieslst]);
    const numberOfSources = Math.min(8, shuffledLikedMovies.length);
    const selectedMovies = shuffledLikedMovies.slice(0, numberOfSources);
    console.log("Selected movies for recommendations:", numberOfSources, selectedMovies);

    const recommendationsPromises = selectedMovies.map(movieId => 
      tmdbService.getRecommendations(movieId)
    );
    
    const recommendationsArrays = await Promise.all(recommendationsPromises);
    console.log("Recommendations arrays:", recommendationsArrays);
    
    let allRecommendations = recommendationsArrays.flat();    
    movies.value = shuffleArray(allRecommendations).slice(0, 12);

  } catch (err) {
    console.error('Error loading movies:', err);
    error.value = 'Failed to load movies. Please try again.';
  } finally {
    loading.value = false;
  }
};

const loadTrailer = async (movie) => {
  try {
    const trailer = await tmdbService.getMovieTrailer(movie.id)
    if (trailer) {
      currentTrailer.value = {
        id: movie.id,
        key: trailer.key
      }
    } else {
      currentTrailer.value = null
    }
  } catch (err) {
    console.error('Error loading trailer:', err)
    currentTrailer.value = null
  }
}

const closeTrailer = () => {
  currentTrailer.value = null
}

const navigateToWatchParty = () => {

  try {
  router.push({
    path: `/watch-party`,
  })
} catch (error) {
    console.error('Failed to go to WatchParty', error)
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
  loadMovies()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', debounce(updateVisibleMovies, 250))
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
  animation: fadeIn 1s ease-out forwards;
}
</style>