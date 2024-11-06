<template>
  <div class="main-content">
    <NavBar class="z-10" />
    <TheatricalBackground class="z-0 fixed inset-0 w-full h-full" />
    <div class="flex h-screen text-white z-10 relative mt-16">
      <div class="full-height bg-[#3f2763]">
        <div class="left-panel flex-shrink-0 text-white flex flex-col items-center p-4">
          <div v-if="currentUser">
            <div class="user-info flex items-center gap-2">
              <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-glow">
                {{ currentUser.email[0].toUpperCase() }}
              </div>
              <span class="user-name">{{ currentUser.displayName || currentUser.email }}</span>
            </div>
            <hr class="custom-hr w-full mt-10" />
            <div class="friends-info flex items-center gap-2">
              <h2 class="friends-title">Friends</h2>
              <div v-if="isFetchingFriends" class="loading">Loading friends...</div>
              <div v-if="friendsError" class="error">{{ friendsError }}</div>
              <ul v-else>
                <li v-for="friend in friends" :key="friend.id" class="friend-item">
                  <img :src="friend.avatar" alt="Avatar" class="friend-avatar" />
                  <span>{{ friend.name }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div class="right-panel flex-grow px-5 ml-60">
        <div class="relative mt-5">
          <h3 class="likes-title">TRENDING MOVIES</h3>
          <hr class="border-gray-600 mb-4" />
          <div class="carousel-container border-4 carousel-border overflow-hidden rounded-lg">
            <div class="carousel-inner relative w-full overflow-hidden">
              <div v-if="movies.length > 0" class="carousel-item relative w-full h-64 flex items-center justify-center">
                <img :src="movies[currentSlide].posterPath" class="movie-poster" alt="Movie Poster" />
                <div class="movie-info flex flex-col justify-center text-left ml-4">
                  <h5 class="movie-title movie-desc-font">{{ movies[currentSlide].title }}</h5>
                  <p class="movie-overview mt-2 movie-desc-font">{{ movies[currentSlide].overview }}</p>
                </div>
              </div>
              <div v-else>
                <p>No movies available.</p>
              </div>
            </div>
            <div class="flex justify-end mb-3 mr-4">
              <button class="arrow-left mr-3" @click="prevSlide" v-if="movies.length > 1"></button>
              <button class="arrow-right" @click="nextSlide" v-if="movies.length > 1"></button>
            </div>
          </div>
        </div>

        <div class="mb-10">
          <h3 class="likes-title mt-10">FOR YOU</h3>
          <hr class="border-gray-600 mb-4" />
          <div>
            <div class="flex overflow-hidden relative" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag" @mouseleave="stopDrag">
              <div class="flex transition-transform" :style="{ transform: `translateX(-${currentTranslate}px)` }">
                <div v-for="(mov, index) in moviesCards" :key="'rec-' + index" class="relative flex flex-col shrink-0 w-60 h-50 rounded-lg shadow-md cards mx-1" @mouseenter="startFlyingIcons" @mouseleave="resetFlyingIcons">
                  <div class="relative w-full h-full neon-border-wrapper">
                    <div class="neon-border"></div>
                    <div class="flex-1 p-4 relative group">
                      <div class="flex flex-col mx-1">
                        <div class="w-full">
                          <img :src="mov.posterPath" class="movie-image-placeholder w-22 h-auto" alt="Movie Poster" />
                        </div>
                        <div class="w-full pl-4 mt-2">
                          <h5 class="text-lg font-semibold">{{ mov.title }}</h5>
                          <p class="mb-1 rating-font">Rating: {{ mov.rating }}</p>
                          <p class="text-sm movie-overview">{{ mov.overview }}</p>
                        </div>
                      </div>
                      <div class="mini-icons" v-if="flyingIcons.length > 0">
                        <img v-for="(icon, i) in flyingIcons" :key="i" :src="icon.src" class="mini-icon" :style="icon.style" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import TheatricalBackground from '../components/Backgrounds/TheatricalBackground.vue';
import NavBar from '../components/ui/NavBar.vue';
import tmdbService from '../services/tmdbService'; // Import your TMDB service
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { useFriends } from '../composables/useFriends.js';

const movies = ref([]); // Array to hold popular movies
const moviesCards = ref([]);
const currentUser = ref(null);
const { friends, isFetchingFriends, friendsError, fetchFriends } = useFriends();
const flyingIcons = ref([]);

// Fetch popular movies on component mount
onMounted(async () => {
  try {
    const popularMovies = await tmdbService.getPopularMovies(1); // Fetch movies
    movies.value = popularMovies.slice(0, 3); // Get only the first 3 movies

    const moviesCardsValue = await tmdbService.getMoviesByGenre(53);
    moviesCards.value = moviesCardsValue.slice(0, 10);

    onAuthStateChanged(auth, (user) => {
      currentUser.value = user;
    });

    fetchFriends();

  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }
});

// Carousel functionality
const currentSlide = ref(0);
const cardWidth = 56; // Width of the card in pixels
const cardSpacing = 16; // Spacing between cards
const moveMultiplier = 2; // Multiplier for move distance
const moveDistance = (cardWidth + cardSpacing) * moveMultiplier; // Move distance (width + spacing) multiplied
const currentTranslate = ref(0);
let isDragging = false;
let startX = 0;
let startTranslate = 0;


// Dragging functionality
const startDrag = (event) => {
  isDragging = true; // Start dragging
  startX = event.touches ? event.touches[0].clientX : event.clientX; // Handle touch or mouse
  startTranslate = currentTranslate.value; // Save starting translate value
};

const onDrag = (event) => {
  if (isDragging) {
    const clientX = event.touches ? event.touches[0].clientX : event.clientX; // Handle touch or mouse
    const dx = clientX - startX; // Calculate movement
    // Calculate the maximum translation allowed
    const maxTranslate = (moviesCards.value.length - 1) * moveDistance;

    currentTranslate.value = Math.max(0, Math.min(startTranslate + dx, maxTranslate)); // Clamp value to bounds
  }
};

const stopDrag = () => {
  isDragging = false; // Stop dragging
};

// Slide Navigation Functions
const nextSlide = () => {
  if (currentSlide.value < movies.value.length - 1) {
    currentSlide.value++;
  } else {
    currentSlide.value = 0; // Loop back to the start
  }
};

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--;
  } else {
    currentSlide.value = movies.value.length - 1; // Loop to the end
  }
};

const startFlyingIcons = () => {
  flyingIcons.value = []; // Clear previous flying icons
  let interval = setInterval(() => {
    const newIcon = {
      src: 'path/to/mini-icon.png', // Replace with actual mini icon path or logic to get it dynamically
      style: getRandomPositionStyle() // Generate random position style
    };
    flyingIcons.value.push(newIcon);

    // Remove icon after some time
    setTimeout(() => {
      flyingIcons.value.shift(); // Remove the oldest flying icon
    }, 30000); // Duration of icon's visibility
  }, 800); // Interval of icon generation

  // Store the interval ID so we can clear it on mouse leave
  flyingIcons.value.interval = interval;
};

// Function to reset flying icons on mouse leave
const resetFlyingIcons = () => {
  flyingIcons.value = []; // Clear flying icons
  clearInterval(flyingIcons.value.interval); // Clear the interval
};

// Function to generate random position styles for flying icons
const getRandomPositionStyle = () => {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;

  const xDirection = Math.random() < 0.5 ? -1 : 1; // Random direction for x-axis
  const yDirection = Math.random() < 0.5 ? -1 : 1; // Random direction for y-axis

  const translateX = Math.random() * screenWidth / 2 * xDirection; // Random translateX value
  const translateY = Math.random() * screenHeight / 2 * yDirection; // Random translateY value

  return {
    transform: `translate(${translateX}px, ${translateY}px)`, // Apply random translation
  transition: 'transform 1s ease-in-out', // Animation transition
  position: 'absolute', // Positioning for absolute placement
  };
};

</script>

<style scoped>
.full-height {
  height: auto;
  /* Full height relative to parent */
  display: flex;
  /* Use flexbox to manage children if necessary */
  flex-direction: column;
  /* Column direction for children stacking */
}

.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Keep the full height */
  overflow: hidden;
  /* Prevent overflow */
}

.left-panel {
  position: fixed;
  /* Set position to fixed */
  top: 0;
  /* Align to the top */
  left: 0;
  /* Align to the left */
  width: 16.67%;
  /* 1/6 of the width */
  max-width: 220px;
  /* Optional: set a max width */
  min-width: 120px;
  /* Optional: set a min width */
  height: 100%;
  /* Full height of the viewport */
  transition: width 0.3s;
  /* Smooth transition */
  padding: 16px;
  /* Padding for inner content */
  background-color: rgba(103, 95, 242, 0.5);
  z-index: 10;
  /* Ensure it appears above other elements */
}

.right-panel {
  width: 83.33%;
  /* 5/6 of the width */
  transition: width 0.3s;
  /* Smooth transition */
  display: flex;
  /* Use flex to manage child layout */
  flex-direction: column;
  /* Ensure children stack vertically */
  overflow-x: hidden;
  /* Prevent horizontal overflow */
}

.mini-icons {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none; /* Prevent mouse events on icons */
  display: flex;
  z-index: 50;
}

.mini-icon {
  width: 40px; /* Size of mini icons */
  height: auto;
  margin: 0 5px; /* Space between icons */
  z-index: 50;
}

.movie-desc-font {
  background: linear-gradient(to right, #2217f0, #3931dd);
  /* Gradient from purple to white */
  -webkit-background-clip: text;
  /* Clip background to text */
  -webkit-text-fill-color: transparent;
  /* Make text transparent so the gradient shows */
  font-size: 3rem;
  /* Adjust size as needed */
  font-weight: bold;
  /* Optional: make text bold */
  margin: 0px 40px 0px 10px;
}

.movie-overview {
  display: -webkit-box;
  /* Needed for Safari */
  -webkit-box-orient: vertical;
  /* Specifies the orientation of the box */
  overflow: hidden;
  /* Hides overflowing text */
  -webkit-line-clamp: 3;
  /* Limits the text to 3 lines */
  line-height: 1.5em;
  /* Adjust line height as needed */
  max-height: 8em;
  /* 3 lines * line height */
  text-overflow: ellipsis;
  /* Optional: adds ellipsis at the end */
}

.arrow-left {
  border-top: 20px solid transparent;
  /* Create the top side of the triangle */
  border-bottom: 20px solid transparent;
  /* Create the bottom side of the triangle */
  border-right: 20px solid #675ff2;
  /* Create the left side of the triangle */
  width: 0;
  /* Set width to 0 for triangle */
  height: 0;
  /* Set height to 0 for triangle */
  position: relative;
  /* Ensure positioning context for shadow */
  /* Add two shadows for a more 3D effect */
  box-shadow:
    2px 2px 8px rgba(0, 0, 0, 0.5),
    /* Shadow below */
    -2px -2px 5px rgba(255, 255, 255, 0.6);
  /* Highlight shadow above */
}

/* Optional: Add hover effect for more interactivity */
.arrow-left:hover {
  transform: translateY(-4px);
  /* Lift effect on hover */
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.5),
    /* Darker shadow below */
    -2px -2px 8px rgba(255, 255, 255, 0.8);
  /* Brighter highlight shadow above */
  transition: all 0.2s ease;
  /* Smooth transition effect */
}


.arrow-right {
  border-top: 20px solid transparent;
  /* Create the top side of the triangle */
  border-bottom: 20px solid transparent;
  /* Create the bottom side of the triangle */
  border-left: 20px solid #675ff2;
  ;
  /* Create the left side of the triangle */
  right: 5px;
  width: 0;
  /* Set width to 0 for triangle */
  height: 0;
  /* Set height to 0 for triangle */
  position: relative;
  /* Ensure positioning context for shadow */
  /* Add two shadows for a more 3D effect */
  box-shadow:
    2px 2px 8px rgba(0, 0, 0, 0.5),
    /* Shadow below */
    -2px -2px 5px rgba(255, 255, 255, 0.6);
  /* Highlight shadow above */
}

/* Optional: Add hover effect for more interactivity */
.arrow-right:hover {
  transform: translateY(-4px);
  /* Lift effect on hover */
  box-shadow:
    4px 4px 12px rgba(0, 0, 0, 0.5),
    /* Darker shadow below */
    -2px -2px 8px rgba(255, 255, 255, 0.8);
  /* Brighter highlight shadow above */
  transition: all 0.2s ease;
  /* Smooth transition effect */
}

.custom-hr {
  border: none;
  /* Remove default border */
  height: 3px;
  /* Set thickness */
  background-color: white;
  /* Set color */
}

.user-info {
  display: flex;
  /* Ensure it's a flex container */
  flex-direction: column;
  align-items: center;
  /* Center items vertically */
  gap: 0.5rem;
  /* Add space between the avatar and the username */
  margin-top: 80px;
}

.friends-info {
  display: flex;
  /* Ensure it's a flex container */
  flex-direction: column;
  align-items: center;
  /* Center items vertically */
  gap: 0.5rem;
  /* Add space between the avatar and the username */
  margin-top: 40px;
}

.friends-title {
  font-weight: bold;
  /* Makes the text bold */
  font-size: 1.2rem;
  /* Sets the font size larger than normal */
  margin: 1rem 0;
  /* Optional: Adds some margin above and below */
  text-align: center;
  /* Optional: Centers the text */
}

.username {
  font-size: 1.25rem;
  /* Font size */
  font-weight: 600;
  /* Font weight */
  text-align: center;
  /* Center alignment */
  margin-top: 0.5rem;
  /* Margin */
}

.carousel-container {
  position: relative;
  margin: 0 auto;
  /* Center the carousel */
  width: 100%;
  /* Full width */
  overflow: hidden;
  /* Prevent overflow */
  background: linear-gradient(to right, rgba(175, 108, 234, 0.95), rgba(156, 142, 24, 0.95));
}

.carousel-inner {
  display: flex;
  /* Use flexbox to arrange items */
  overflow: hidden;
  /* Prevent overflow */
}

.carousel-item {
  flex: 0 0 100%;
  /* Each carousel item takes the full width */
}

.movie-poster {
  object-fit: contain;
  /* Maintain aspect ratio */
  height: 80%;
  /* Full height */
  width: auto;
  /* Auto width */
  border: 4px solid #8b8d30;
  /* Border width, style, and color */
  border-radius: 8px;
  /* Optional: Add rounded corners */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  /* Optional: Add shadow for depth */
  margin-left: 30px;
}

.movie-title {
  font-size: 1.25rem;
  /* Font size */
  font-weight: bold;
  /* Font weight */
}

.movie-overview {
  font-size: 0.875rem;
  /* Font size */
}

.rating-font {
  font-style: italic;
  color: rgb(166, 148, 11);
  font-weight: bold;
}

.neon-border-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.carousel-border {
  border: 2px solid #675ff2;
  border-radius: 8px;
  box-shadow: 0 0 10px #675ff2;
}

.neon-border {
  position: absolute;
  inset: 0;
  border: 2px solid #675ff2;
  border-radius: 8px;
  box-shadow: 0 0 10px #675ff2;
  opacity: 0.5;
  pointer-events: none;
  /* Allow interaction with the card below */
  transition: all 0.3s ease;
}

.cards,
.cards * {
  user-select: none;
  /* Disable text selection */
}

.cards {
  transition: transform 0.3s ease;
  /* Smooth transition for scaling */
}

.cards h5,
.cards p {
  opacity: 0.9;
  /* Set opacity for text elements */
}

.cards:hover {
  transform: scale(1.05);
  /* Enlarge the card slightly on hover */
  opacity: 1;
  box-shadow: 0 0 20px #675FF2;
}

.neon-border .carousel-border {
  opacity: 1;
  box-shadow: 0 0 20px #675FF2;
}

.likes-title {
  font-size: 2rem;
  /* Font size */
  font-weight: 0900;
  /* Font weight */
  font-style: italic;
  margin-bottom: 0.25rem;
  /* Margin */
  text-align: center;
  /* Text alignment */
  background-image: linear-gradient(90deg, #cdb91f, #e0d751);
  /* Gradient colors */
  -webkit-background-clip: text;
  /* Clip the background to the text */
  color: transparent;
  /* Make the text transparent to show the gradient */
}

.movie-card {
  background-color: #3f2763;
  /* Card background */
  border-radius: 0.5rem;
  /* Rounded corners */
  margin: 0.5rem;
  /* Margin between cards */
  transition: transform 0.3s;
  /* Smooth hover effect */
  flex-shrink: 0;
  /* Prevent shrinking */
}

.movie-image-placeholder {
  background-color: #555;
  /* Placeholder color */
  height: 100%;
  /* Full height of the container */
  width: 100%;
  /* Full width */
  display: flex;
  /* Use flexbox to center the image */
  align-items: center;
  /* Center image vertically */
  justify-content: center;
  /* Center image horizontally */
}

.navigation-button {
  background-color: #9e8bba;
  /* Button background color */
  color: white;
  /* Text color */
  border: none;
  /* No border */
  border-radius: 50%;
  /* Circular shape */
  padding: 0.5rem;
  /* Padding */
  cursor: pointer;
  /* Pointer cursor */
  z-index: 20;
  /* Layering */
}

/* Ensure responsiveness */
@media (max-width: 768px) {
  .left-panel {
    display: none;
    /* Hide left panel on mobile if not needed */
  }
}
</style>