<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white relative overflow-hidden">
    <NavBar />
    <div class="absolute inset-0 bg-gray-900 opacity-20"></div>
    <div class="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 animate-gradient-shift"></div>
    <div class="absolute inset-0 overflow-hidden">
      <div v-for="i in 20" :key="i" class="shooting-star" :style="getShootingStarStyle()"></div>
    </div>
    <div class="container mx-auto px-4 pt-20 pb-8 relative z-10">
      <div class="mb-6">
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <button
              @click="setActiveTab('friends')"
              :class="['px-4 py-2 rounded-md text-sm font-medium', activeTab === 'friends' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300']"
            >
              Friends
            </button>
            <button
              @click="setActiveTab('groups')"
              :class="['px-4 py-2 rounded-md text-sm font-medium', activeTab === 'groups' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300']"
            >
              Groups
            </button>
          </div>
          <div class="flex items-center space-x-2">
            <div class="relative w-64">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="`Search ${activeTab}...`"
                class="pl-10 pr-4 py-2 w-full rounded-md bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-500"
              />
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <button
              @click="toggleGenreFilter"
              class="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-300"
            >
              Filter
            </button>
          </div>
        </div>
        
        <div v-if="showGenreFilter" class="mb-4">
          <div class="flex flex-wrap gap-2 pb-4 max-h-32 overflow-y-auto">
            <button
              v-for="genre in genres"
              :key="genre"
              @click="toggleGenreSelection(genre)"
              :class="[
                'px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300',
                selectedGenres.includes(genre)
                  ? 'bg-blue-500/50 backdrop-blur-sm text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                  : 'bg-blue-500/20 backdrop-blur-sm text-blue-100 hover:bg-blue-400/30'
              ]"
            >
              {{ genre }}
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div
          v-for="item in paginatedItems"
          :key="item.id"
          class="relative"
          @mouseenter="showDetails(item)"
          @mouseleave="hideDetails"
        >
          <button
            @click="toggleSelection(item)"
            :class="[
              'w-full aspect-square rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-2 relative overflow-hidden group',
              isSelected(item)
                ? 'bg-blue-500/40 backdrop-blur-md border-2 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                : 'bg-gray-700/30 hover:bg-gray-600/40 backdrop-blur-md border-2 border-gray-500/50 hover:border-blue-400/50'
            ]"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <img
              :src="defaultAvatar"
              :alt="item.name"
              class="w-20 h-20 rounded-full mb-2 border-2 border-white shadow-lg relative z-10"
            />
            <span class="font-semibold text-sm text-center relative z-10 text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">{{ item.name }}</span>
            <div v-if="activeTab === 'friends'" class="absolute bottom-2 left-2 z-10">
              {{ getSnackEmoji(item.snackPreference) }}
            </div>
            <div v-if="activeTab === 'groups'" class="text-xs relative z-10 text-gray-300">{{ item.members.length }} members</div>
          </button>
          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
          >
            <div v-if="hoveredItem === item" class="absolute top-full left-0 mt-2 w-72 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-lg p-4 z-20 border border-gray-700 overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-50"></div>
              <div class="relative z-10">
                <h3 class="text-lg font-semibold mb-2 text-white">{{ item.name }}</h3>
                <div v-if="activeTab === 'friends'" class="space-y-3">
                  <p class="text-sm text-gray-300 flex items-center">
                    <span class="mr-2">{{ getSnackEmoji(item.snackPreference) }}</span>
                    <span>{{ item.snackPreference }}</span>
                  </p>
                  <div>
                    <h4 class="text-sm font-semibold mb-1 text-gray-400">Matched Genres:</h4>
                    <div class="flex flex-wrap gap-1">
                      <span v-for="genre in item.genres" :key="genre" class="text-xs bg-blue-500/30 text-blue-200 px-2 py-1 rounded-full">{{ genre }}</span>
                    </div>
                  </div>
                  <div>
                    <h4 class="text-sm font-semibold mb-1 text-gray-400">Matched Movies:</h4>
                    <ul class="text-xs text-gray-300">
                      <li v-for="movie in item.matchedMovies" :key="movie" class="mb-1 flex items-center">
                        <span class="mr-2">🎬</span>{{ movie }}
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-if="activeTab === 'groups'">
                  <h4 class="text-sm font-semibold mb-1 text-gray-400">Members:</h4>
                  <ul class="text-xs text-gray-300">
                    <li v-for="member in item.members.slice(0, 3)" :key="member.id" class="mb-1 flex items-center">
                      <span class="mr-2">👤</span>{{ member.name }}
                    </li>
                    <li v-if="item.members.length > 3" class="text-gray-400 italic">and {{ item.members.length - 3 }} more...</li>
                  </ul>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="flex justify-center items-center space-x-2 mt-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="bg-blue-500/50 backdrop-blur-sm hover:bg-blue-600/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] px-4 py-2 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-gray-300">Page {{ currentPage }} of {{ totalPages }}</span>
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="bg-blue-500/50 backdrop-blur-sm hover:bg-blue-600/50 shadow-[0_0_10px_rgba(59,130,246,0.3)] px-4 py-2 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>



      <div v-if="selectedItems.length > 0" class="fixed bottom-8 left-1/2 transform -translate-x-1/2">
        <button 
          @click="openPlanMovieNightDialog"
          class="bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm hover:from-blue-700/80 hover:to-purple-700/80 text-white px-8 py-4 rounded-full text-xl font-bold shadow-[0_0_20px_rgba(88,80,236,0.5)] hover:shadow-[0_0_25px_rgba(88,80,236,0.7)] transition-all duration-300"
        >
          <span class="mr-2">📅</span>
          Plan Movie Night ({{ selectedItems.length }} selected)
        </button>
      </div>
      <MovieNightPlanningModal v-if="showPlanningModal" :selectedItems="selectedItems" @close="showPlanningModal = false" />
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import NavBar from '@/components/ui/NavBar.vue';
import defaultAvatar from '@/assets/images/default-avatar.png';
import MovieNightPlanningModal from './createWatchPartyModal.vue';


const hoveredItem = ref(null);
const activeTab = ref('friends');
const selectedItems = ref([]);
const selectedGenres = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const showGenreFilter = ref(false);
const showDetailsTimeout = ref(null);
const hideDetailsTimeout = ref(null);

const ITEMS_PER_PAGE = 15;

const friends = ref([]);
const groups = ref([]);
const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Adventure', 'Fantasy', 'Animation'];

onMounted(() => {
  // Mock data generation
  friends.value = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Friend ${String.fromCharCode(65 + i % 26)}${Math.floor(i / 26) + 1}`,
    avatar: `/placeholder.svg?height=80&width=80&text=${String.fromCharCode(65 + i % 26)}${Math.floor(i / 26) + 1}`,
    matchedMovies: ['Inception', 'The Matrix', 'Interstellar', 'Pulp Fiction', 'The Shawshank Redemption']
      .sort(() => 0.5 - Math.random()).slice(0, 3),
    genres: ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'].sort(() => 0.5 - Math.random()).slice(0, 2),
    snackPreference: ['Popcorn', 'Nachos', 'Candy', 'Soda', 'Ice Cream'][Math.floor(Math.random() * 5)],
  })).sort((a, b) => a.name.localeCompare(b.name));

  groups.value = [
    { id: 1, name: 'Movie Buffs', members: friends.value.slice(0, 5) },
    { id: 2, name: 'Sci-Fi Lovers', members: friends.value.slice(5, 10) },
    { id: 3, name: 'Comedy Club', members: friends.value.slice(10, 15) },
    { id: 4, name: 'Drama Enthusiasts', members: friends.value.slice(15, 20) },
    { id: 5, name: 'Action Fans', members: friends.value.slice(20, 25) },
  ];
});

const filteredItems = computed(() => {
  const items = activeTab.value === 'friends' ? friends.value : groups.value;
  return items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenres = selectedGenres.value.length === 0 || 
      (activeTab.value === 'friends' && item.genres.some(genre => selectedGenres.value.includes(genre)));
    return matchesSearch && matchesGenres;
  });
});

const paginatedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  return filteredItems.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(filteredItems.value.length / ITEMS_PER_PAGE));

const setActiveTab = (tab) => {
  activeTab.value = tab;
  selectedItems.value = [];
  currentPage.value = 1;
};

const toggleSelection = (item) => {
  const index = selectedItems.value.findIndex(i => i.id === item.id);
  if (index === -1) {
    selectedItems.value.push(item);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

const isSelected = (item) => selectedItems.value.some(i => i.id === item.id);

const toggleGenreSelection = (genre) => {
  const index = selectedGenres.value.indexOf(genre);
  if (index === -1) {
    selectedGenres.value.push(genre);
  } else {
    selectedGenres.value.splice(index, 1);
  }
  currentPage.value = 1;
};

const toggleGenreFilter = () => {
  showGenreFilter.value = !showGenreFilter.value;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const getSnackEmoji = (snack) => {
  const snackEmojis = {
    'Popcorn': '🍿',
    'Nachos': '🧀',
    'Candy': '🍬',
    'Soda': '🥤',
    'Ice Cream': '🍦'
  };
  return snackEmojis[snack] || '🍿';
};

const getShootingStarStyle = () => {
  return {
    '--delay': `${Math.random() * 5}s`,
    '--duration': `${Math.random() * 2 + 1}s`,
    '--top': `${Math.random() * 100}%`,
    '--left': `${Math.random() * 100}%`,
  };
};

const openPlanMovieNightDialog = () => {
  // Implement plan movie night dialog logic
  console.log('Open plan movie night dialog');
};

const showDetails = (item) => {
  clearTimeout(hideDetailsTimeout.value);
  showDetailsTimeout.value = setTimeout(() => {
    hoveredItem.value = item;
  }, 100);
};

const hideDetails = () => {
  clearTimeout(showDetailsTimeout.value);
  hideDetailsTimeout.value = setTimeout(() => {
    hoveredItem.value = null;
  }, 300);
};
</script>

<style scoped>
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% {   background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
.animate-gradient-shift {
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
}
.shooting-star {
  position: absolute;
  width: 2px;
  height: 2px;
  background-color: white;
  border-radius: 50%;
  opacity: 0;
  animation: shoot var(--duration) linear infinite;
  animation-delay: var(--delay);
  top: var(--top);
  left: var(--left);
}
.shooting-star::before {
  content: '';
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 1px;
  background: linear-gradient(90deg, white, transparent);
}
@keyframes shoot {
  0% {
    transform: translate(0, 0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translate(300px, 300px) rotate(-45deg);
    opacity: 0;
  }
}
</style>