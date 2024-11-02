<template>
  <div class="main-content">
    <!-- Navbar at the top -->
    <NavBar class="z-10" />

    <!-- Background component with a lower z-index -->
    <TheatricalBackground class="z-0 fixed inset-0 w-full h-full" />

    <!-- Main content over the background -->
    <div class="flex h-screen text-white z-10 relative mt-16">
      <!-- Left Side -->
      <div class="left-panel fixed inset-y-0 left-0 w-1/6 bg-[#3f2763] text-white flex flex-col items-center">
        <!-- Profile Picture -->
        <img :src="userAvatar" alt="User Avatar" class="w-24 h-24 rounded-full mt-20" />

        <!-- User Name -->
        <h2 class="text-xl font-semibold text-center mt-2">Person 1</h2>

        <!-- Spacing -->
        <div class="my-4"></div>

        <hr class="border-white w-full" />
        <ul class="space-y-2 text-center -mb-15"></ul>

        <!-- Friends List -->
        <div class="relative flex items-center justify-center">
          <h3 class="text-lg font-medium underline">Friends</h3>
          <span
            class="absolute left-20 top-1/2 -translate-y-1/2 navigation-button bg-purple-600 text-white rounded-full w-7 h-auto items-center justify-center">
            &gt; <!-- Right arrow symbol -->
          </span>
        </div>
        <ul class="space-y-2 text-center -mt-10 mb-20">
          <li>Friend 1</li>
          <li>Friend 2</li>
          <li>Friend 3</li>
        </ul>
      </div>

      <!-- Right Side -->
      <div class="right-panel w-5/6 ml-60">
        <!-- Recommended for You Section -->
        <div class="mb-10">
          <div class="flex items-center justify-between mt-3 mb-1">
            <h3 class="text-2xl font-semibold">Recommended for You</h3>
            <button class="bg-purple-600 text-white px-4 py-2 rounded-lg">
              Generate Your Recommendation
            </button>
          </div>
          <hr class="border-gray-600 mb-4" />

          <!-- Carousel for Movie Cards -->
          <div class="flex overflow-hidden relative" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
            @mouseleave="stopDrag">
            <div class="flex transition-transform" :style="{ transform: `translateX(-${currentTranslate}px)` }">
              <div v-for="card in cards" :key="'rec-' + card"
                class="relative flex flex-col shrink-0 w-56 bg-[#3f2763] rounded-lg shadow-md cards mx-1">
                <div class="relative w-full h-full neon-border-wrapper">
                  <div class="neon-border"></div> <!-- Neon border -->
                  <div class="flex-1 p-4 relative"> <!-- Card content -->
                    <div class="flex flex-col mx-1">
                      <div class="w-full">
                        <div class="movie-image-placeholder bg-secondary h-32 w-full"></div>
                      </div>
                      <div class="w-full pl-4 mt-2">
                        <h5 class="text-lg font-semibold">Movie Title</h5>
                        <p class="mb-1">4.5 <span class="text-warning">★ ★ ★ ★ ★</span> (100 ratings)</p>
                        <p class="text-sm truncate">Movie description goes here. It's a placeholder for a brief overview
                          of the movie.</p>
                      </div>
                    </div>
                    <hr class="border-gray-600 my-2" />
                    <div class="flex justify-between items-center">
                      <div class="flex items-center">
                        <span class="ml-2 text-sm">Friend 1 and others have the same interests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back Navigation Button -->
            <button @mousedown="startScrolling('left')" @mouseup="stopScrolling" @mouseleave="stopScrolling"
              class="absolute left-0 top-1/2 transform -translate-y-1/2 navigation-button">
              &lt; <!-- Simple left arrow -->
            </button>

            <!-- Front Navigation Button -->
            <button @mousedown="startScrolling('right')" @mouseup="stopScrolling" @mouseleave="stopScrolling"
              class="absolute right-0 top-1/2 transform -translate-y-1/2 navigation-button">
              &gt; <!-- Simple right arrow -->
            </button>

          </div>
        </div>

        <!-- My Likes Section -->
        <div class="mb-10">
          <h3 class="text-2xl font-semibold mb-1 mt-3">My Likes</h3>
          <hr class="border-gray-600 mb-4" />

          <!-- Carousel for Movie Cards -->
          <div class="flex overflow-hidden relative" @mousedown="startDrag" @mousemove="onDrag" @mouseup="stopDrag"
            @mouseleave="stopDrag">
            <div class="flex transition-transform" :style="{ transform: `translateX(-${currentTranslate}px)` }">
              <div v-for="card in cards" :key="'rec-' + card"
                class="relative flex flex-col shrink-0 w-56 bg-[#3f2763] rounded-lg shadow-md cards mx-1">
                <div class="relative w-full h-full neon-border-wrapper">
                  <div class="neon-border"></div> <!-- Neon border -->
                  <div class="flex-1 p-4 relative"> <!-- Card content -->
                    <div class="flex flex-col mx-1">
                      <div class="w-full">
                        <div class="movie-image-placeholder bg-secondary h-32 w-full"></div>
                      </div>
                      <div class="w-full pl-4 mt-2">
                        <h5 class="text-lg font-semibold">Movie Title</h5>
                        <p class="mb-1">4.5 <span class="text-warning">★ ★ ★ ★ ★</span> (100 ratings)</p>
                        <p class="text-sm truncate">Movie description goes here. It's a placeholder for a brief overview
                          of the movie.</p>
                      </div>
                    </div>
                    <hr class="border-gray-600 my-2" />
                    <div class="flex justify-between items-center">
                      <div class="flex items-center">
                        <span class="ml-2 text-sm">Friend 1 and others have the same interests</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Back Navigation Button -->
            <button @mousedown="startScrolling('left')" @mouseup="stopScrolling" @mouseleave="stopScrolling"
              class="absolute left-0 top-1/2 transform -translate-y-1/2 navigation-button">
              &lt; <!-- Simple left arrow -->
            </button>

            <!-- Front Navigation Button -->
            <button @mousedown="startScrolling('right')" @mouseup="stopScrolling" @mouseleave="stopScrolling"
              class="absolute right-0 top-1/2 transform -translate-y-1/2 navigation-button">
              &gt; <!-- Simple right arrow -->
            </button>

          </div>
        </div>


      </div>
      <!--end of right panel-->



    </div>
  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue';
import TheatricalBackground from '../components/Backgrounds/TheatricalBackground.vue';
import NavBar from '../components/ui/NavBar.vue';

const injectedAvatar = inject('userAvatar');
const userAvatar = computed(() => injectedAvatar?.value || '@/assets/images/default-avatar.png'); // default image as fallback

const cards = ref(Array.from({ length: 10 }, (_, index) => index + 1)); // Sample cards
const currentIndex = ref(0);
const cardWidth = 56; // Width of the card in pixels
const cardSpacing = 16; // Spacing between cards
const moveMultiplier = 2; // Multiplier for move distance
const moveDistance = (cardWidth + cardSpacing) * moveMultiplier; // Move distance (width + spacing) multiplied
const currentTranslate = ref(0);
let scrollInterval = null;
let isDragging = false;
let startX = 0;
let startTranslate = 0;

// Function to move to the next card
const nextCard = () => {
  if (currentIndex.value < cards.value.length - 1) {
    currentIndex.value++;
    updateTranslate();
  }
};

// Function to move to the previous card
const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
    updateTranslate();
  }
};

// Update the translate value based on the current index
const updateTranslate = () => {
  currentTranslate.value = currentIndex.value * moveDistance; // Use moveDistance for translation
};

// Start scrolling when button is pressed
const startScrolling = (direction) => {
  // Immediately move to the next/previous card
  if (direction === 'right') {
    nextCard();
  } else {
    prevCard();
  }

  // Set an interval to keep moving the card in the specified direction
  scrollInterval = setInterval(() => {
    if (direction === 'right') {
      nextCard();
    } else {
      prevCard();
    }
  }, 300); // Adjust the interval duration as needed
};

// Stop scrolling when button is released or leaves
const stopScrolling = () => {
  clearInterval(scrollInterval);
};

// Start dragging
const startDrag = (event) => {
  isDragging = true;
  startX = event.clientX; // Store the starting mouse position
  startTranslate = currentTranslate.value; // Store the starting translate value
};

// On drag movement
const onDrag = (event) => {
  if (!isDragging) return; // Exit if not dragging
  const deltaX = event.clientX - startX; // Calculate mouse movement
  currentTranslate.value = startTranslate - deltaX; // Update translate value based on mouse movement

  // Boundaries to prevent overscrolling
  if (currentTranslate.value < 0) {
    currentTranslate.value = 0; // Prevent scrolling left past the first card
  }
  if (currentTranslate.value > (cards.value.length - 1) * moveDistance) {
    currentTranslate.value = (cards.value.length - 1) * moveDistance; // Prevent scrolling right past the last card
  }
};

// Stop dragging
const stopDrag = () => {
  isDragging = false; // Reset dragging state

  // Snap to the closest card based on the current translation
  const cardCount = cards.value.length;
  const index = Math.round(currentTranslate.value / moveDistance);
  currentIndex.value = Math.max(0, Math.min(index, cardCount - 1)); // Ensure index is within bounds
  updateTranslate(); // Update the translate value to the new index
};
</script>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  /* Prevent body from scrolling */
}

.main-content {
  min-height: 100vh;
  background: #0A0A1F;
}

.flex {
  display: flex;
  height: 100%;
  /* Ensure the flex container takes full height */
}

.left-panel {
  height: 100vh;
  /* Full height of the viewport */
  z-index: 10;
  /* Ensure it stays above the background */
  padding: 1rem;
  /* Add padding if needed */
  box-sizing: border-box;
  /* Include padding in width/height */
}

.right-panel {
  width: 83.3333%;
  /* 5/6 of the width (1 - 1/6) */
  padding: 1rem;
  /* Added padding to right panel */
  overflow-y: auto;
  /* Allow scrolling only in the right panel */
  box-sizing: border-box;
  /* Include padding in width */
}

/* Preventing internal scrollbars */
.right-panel>* {
  flex-shrink: 0;
  /* Prevent children from shrinking */
}

.movie-image-placeholder {
  background: #4B5563;
  /* Tailwind's gray-600 */
}

.neon-border-wrapper {
  position: relative;
  width: 100%;
  /* Ensure it takes full size of the card */
  height: 100%;
  /* Ensure it takes full size of the card */
}

.neon-border {
  position: absolute;
  inset: 0;
  /* Cover the entire card */
  border: 2px solid #675ff2;
  border-radius: 8px;
  /* Adjusted radius for better appearance */
  box-shadow: 0 0 10px #675ff2;
  opacity: 0.5;
  pointer-events: none;
  /* Allow interaction with the card below */
  transition: all 0.3s ease;
}

.cards:hover .neon-border {
  opacity: 1;
  box-shadow: 0 0 20px #675FF2;
}

.navigation-button {
  background-color: #9e8bba;
  /* Background color for the button */
  color: white;
  /* Text color */
  border: none;
  /* Remove default border */
  border-radius: 25%;
  /* Make it circular */
  padding: 10px;
  /* Add some padding for the button */
  cursor: pointer;
  /* Change cursor on hover */
  z-index: 20;
  /* Ensure it stays above the carousel */
}

/* Additional styles for the carousel */
.carousel {
  transition: transform 0.3s ease;
  /* Smooth transition for carousel */
}
</style>
