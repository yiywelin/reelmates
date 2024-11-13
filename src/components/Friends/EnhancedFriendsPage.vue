<template>
  <div class="min-h-screen relative overflow-hidden">
    <FriendsBackground />
    <NavBar />
    <div class="container mx-auto px-4 pt-20 pb-8 relative z-10">
      <div class="mb-6">
        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-0">
        <!-- Tab buttons with improved mobile layout -->
        <div class="w-full rounded-xl overflow-hidden bg-gray-800/50">
        <div class="flex w-full">
          <button
            @click="setActiveTab('friends')"
            :class="[
              'w-1/2 py-3 text-base font-medium flex items-center justify-center transition-colors duration-200', 
              activeTab === 'friends' 
                ? 'bg-blue-700 text-white' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            Friends
          </button>
          <button
            @click="setActiveTab('groups')"
            :class="[
              'w-1/2 py-3 text-base font-medium flex items-center justify-center transition-colors duration-200',
              activeTab === 'groups' 
                ? 'bg-green-500 text-white' 
                : 'text-gray-400 hover:text-white'
            ]"
          >
            Groups
          </button>
        </div>
</div>
          <!-- Control buttons and search section -->
          <div class="w-full px-2 sm:px-0">
            <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <!-- Action buttons group -->
              <div class="flex gap-2 shrink-0">
                <!-- Add Friend button -->
                <div class="relative group" v-if="activeTab === 'friends'">
                  <button
                    @click="showAddFriendModal = true"
                    :class="['p-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300', 
                      friends.length === 0 ? 'pulse-button' : '']"
                  >
                    <UserPlusIcon class="w-5 h-5" />
                  </button>
                  <span class="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Add Friend
                  </span>
                </div>

                <!-- Create Group button -->
                <div class="relative group" v-if="activeTab === 'groups'">
                  <button
                    @click="showCreateGroupModal = true"
                    :class="['p-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300',
                      groups.length === 0 ? 'pulse-button' : '']"
                  >
                    <UserGroupIcon class="w-5 h-5" />
                  </button>
                  <span class="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Create Group
                  </span>
                </div>

                <!-- Plan Movie Night Button -->
                <div class="relative group">
                  <button
                    @click="showPlanningModal = true"
                    class="p-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                  >
                    <CalendarIcon class="w-5 h-5" />
                  </button>
                  <span class="absolute left-1/2 -translate-x-1/2 -bottom-8 bg-gray-800 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Plan Movie Night
                  </span>
                </div>
              </div>

              <!-- Search input -->
              <div class="relative flex-1 min-w-[120px]">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="`Search ${activeTab}...`"
                  class="w-full pl-8 pr-4 py-2.5 text-sm rounded-md bg-gray-800 text-white border-none focus:ring-2 focus:ring-blue-500"
                />
                <span class="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              </div>
              
              <!-- Filter button -->
              <button
                @click="toggleGenreFilter"
                class="px-4 py-2.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600 transition-colors duration-300 text-sm whitespace-nowrap shrink-0"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
        
        <!-- Genre filter -->
        <div v-if="showGenreFilter" class="mt-4">
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
        <div v-if="activeTab === 'friends' && friends.length === 0" class="text-center col-span-full">
          <p class="text-xl mb-4">You have no friends, here's a cute cat for you.</p>
          <div class="w-80 h-64 mx-auto overflow-hidden rounded-lg shadow-lg">
            <img :src="randomCatGif" alt="Cute cat" class="w-full h-full object-cover" />
          </div>        
        </div>
        <div
          v-for="item in paginatedItems"
          :key="item.id"
          class="relative group"
          @mouseenter="showDetails(item)"
          @mouseleave="hideDetails"
        >
          <button
            @click="toggleSelection(item)"
            class="w-full aspect-square rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-4 relative overflow-hidden"
            :class="[
              isSelected(item)
                ? 'bg-blue-500/40 backdrop-blur-md border-2 border-blue-400'
                : 'bg-gray-700/30 hover:bg-gray-600/40 backdrop-blur-md border-2 border-gray-500/50'
            ]"
          >
            <template v-if="activeTab === 'friends'">
              <div 
                :data-avatar-id="item.id"
                class="w-20 h-20 rounded-full mb-2 flex items-center justify-center shadow-lg relative z-10 avatar-container"
                :style="{
                  backgroundColor: item.randomColor || generateRandomColor()
                }"
              >
                <span class="text-2xl font-bold text-white">
                  {{ getInitials(item.name) }}
                </span>
              </div>
            </template>
            <template v-else>
              <button 
                @click.stop="editingGroup = item"
                class="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700/50 transition-colors duration-200 z-20"
                title="Edit group name"
              >
                <PencilIcon class="h-4 w-4 text-gray-400 hover:text-white" />
              </button>
              <div class="relative" @click.stop>
                <div 
                  class="w-20 h-20 rounded-full mb-2 border-2 border-white shadow-lg relative z-10 cursor-pointer group overflow-hidden"
                  @click.stop="handleImageClick(item)"
                >
                  <template v-if="item.photoURL">
                    <img
                      :src="item.photoURL"
                      :alt="item.name"
                      class="w-full h-full object-cover"
                    />
                  </template>
                  <template v-else>
                    <GroupAnimations 
                      :seed="item.id.charCodeAt(0) / 255" 
                      class="w-full h-full"
                    />
                  </template>
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50">
                    <span class="text-xs text-white px-2 py-1 rounded">Change Photo</span>
                  </div>
                </div>
              </div>
            </template>
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
                <template v-if="activeTab === 'friends'">
                  <p class="text-sm text-gray-300">{{ item.email }}</p>
                  <p class="text-sm text-gray-300">Last Active: {{ formatDate(item.lastActive) }}</p>
                  <div class="mt-2">
                    <h4 class="text-sm font-semibold mb-1 text-gray-400">Most Recent Likes:</h4>
                    <ul class="text-xs text-gray-300">
                      <li v-for="movie in getLikedMovies(item)" :key="movie" class="mb-1">
                        {{ movie }}
                      </li>
                    </ul>
                  </div>
                </template>
                <template v-else>
                  <p class="text-sm text-gray-300">Members: {{ item.members ? item.members.length : 0 }}</p>
                  <div class="mt-2">
                    <h4 class="text-sm font-semibold mb-1 text-gray-400">Members:</h4>
                    <ul class="text-xs text-gray-300">
                      <li v-for="member in item.memberNames?.slice(0, 5)" :key="member" class="mb-1">
                        {{ member }}
                      </li>
                      <li v-if="item.members && item.members.length > 5" class="text-xs text-gray-400 italic">
                        and {{ item.members.length - 5 }} more...
                      </li>
                    </ul>
                  </div>
                  <div class="mt-2">
                    <h4 class="text-sm font-semibold mb-1 text-gray-400">Movie Preferences:</h4>
                    <p class="text-xs text-gray-300">Genres: {{ item.moviePreferences?.genres?.join(', ') || 'N/A' }}</p>
                    <p class="text-xs text-gray-300">Release Years: {{ item.moviePreferences?.releaseYearRange?.start || 'N/A' }} - {{ item.moviePreferences?.releaseYearRange?.end || 'N/A' }}</p>
                  </div>
                  <div v-if="item.upcomingEvents && item.upcomingEvents.length > 0" class="mt-2">
                    <h4 class="text-sm font-semibold mb-1 text-gray-400">Next Event:</h4>
                    <p class="text-xs text-gray-300">{{ item.upcomingEvents[0].movieName }}</p>
                    <p class="text-xs text-gray-300">{{ formatDate(item.upcomingEvents[0].date) }}</p>
                  </div>
                </template>
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
      <!-- Bottom action button -->
      <div v-if="selectedItems.length > 0" class="fixed bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 w-full px-4 sm:w-auto">
        <button 
          @click="handleWatchpartyClick"
          class="w-full sm:w-auto bg-gradient-to-r from-blue-600/80 to-purple-600/80 backdrop-blur-sm hover:from-blue-700/80 hover:to-purple-700/80 text-white px-4 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-xl font-bold shadow-[0_0_20px_rgba(88,80,236,0.5)] hover:shadow-[0_0_25px_rgba(88,80,236,0.7)] transition-all duration-300"
        >
          <span class="mr-2">📅</span>
          Create Watchparty ({{ selectedItems.length }})
        </button>
      </div>
      <MovieNightPlanningModal v-if="showPlanningModal" :selectedItems="selectedItems" @close="showPlanningModal = false" />
      <AddFriendModal :is-open="showAddFriendModal" @close="showAddFriendModal = false" @friendAdded="handleFriendAdded" />
      <CreateGroupModal :is-open="showCreateGroupModal" @close="showCreateGroupModal = false" @groupCreated="handleGroupCreated" />
      <EditGroupNameModal v-if="editingGroup" :group="editingGroup" @close="editingGroup = null" @updated="handleGroupNameUpdated"
  />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed} from 'vue'
import NavBar from '@/components/ui/NavBar.vue';
import defaultAvatar from '@/assets/images/default-avatar.png';
import { UserPlusIcon, UserGroupIcon , CalendarIcon , PencilIcon} from '@heroicons/vue/24/solid';
import MovieNightPlanningModal from '@/components/Friends/PlanWatchPartyModal.vue';
import { getAuth } from 'firebase/auth'
import { db } from '../../firebaseConfig'
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import AddFriendModal from '@/components/Friends/AddFriendModal.vue';
import CreateGroupModal from '@/components/Friends/CreateGroupModal.vue';
import { handleCreateWatchparty } from '@/utils/watchpartyUtils';
import { useRouter } from 'vue-router';
import EditGroupNameModal from '@/components/Friends/EditGroupNameModal.vue'
import { uploadGroupPhoto } from '@/utils/imageUtils'
import FriendsBackground from '@/components/Backgrounds/FriendsBackground.vue'
import GroupAnimations from '@/components/Friends/GroupAnimations.vue'

const router = useRouter()

const handleWatchpartyClick = async () => {
  try {
    const { groupId, chatId } = await handleCreateWatchparty(selectedItems.value, activeTab.value)
    router.push({
      name: 'recommendations',
      params: { groupId, chatId }
    })
  } catch (error) {
    console.error('Failed to create watchparty:', error)
  }
}

// Initialize auth
const auth = getAuth()

const loading = ref(false);
const error = ref(null);

const hoveredItem = ref(null);
const activeTab = ref('friends');
const selectedItems = ref([]);
const selectedGenres = ref([]);
const searchQuery = ref('');
const currentPage = ref(1);
const showGenreFilter = ref(false);
const showDetailsTimeout = ref(null);
const hideDetailsTimeout = ref(null);
const showPlanningModal = ref(false);
const showAddFriendModal = ref(false);
const showCreateGroupModal = ref(false);
const editingGroup = ref(null)
// const fileInput = ref(null)

const friends = ref([]);
const groups = ref([]);
const genres = ['Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance', 'Adventure', 'Fantasy', 'Animation'];

const ITEMS_PER_PAGE = 15

const catGifs = [
  'https://media.giphy.com/media/5uv4Cjy3vVX5KUKdOQ/giphy.gif?cid=ecf05e477riobw5yqyoot5y9vn36q8lqb98qwi8qddivvirc&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/4Iw2OzgiiTc4M/giphy.gif?cid=790b7611ovp4xe5rovqpuqj16fernfibkp8ij95akh2en7vp&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/C23cMUqoZdqMg/giphy.gif?cid=790b7611ovp4xe5rovqpuqj16fernfibkp8ij95akh2en7vp&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/1KHBPmEOkv0B2/giphy.gif?cid=ecf05e47rpaxxiup39k10pr5jomdr249iwh98s4h4iaul2oz&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/v6aOjy0Qo1fIA/giphy.gif?cid=790b76113knd32aq79520997blnzwoxrtzapkin8uo56lqmc&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/aPAvJNgLDQL8qBSuxl/giphy.gif?cid=790b7611xi4nrzb77dlaxn7vye0z2g2g7nkp98bda5l9zn8t&ep=v1_gifs_search&rid=giphy.gif&ct=g',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2t3djkwZGlmZ2wzYWhzbWxmNzg0dnJscTluNnk4amxtZ3htN2loYSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/wkPgpQeAlCnXW/giphy.gif'
];

const randomCatGif = computed(() => {
  return catGifs[Math.floor(Math.random() * catGifs.length)];
});

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const loadFriends = async () => {
  try {
    loading.value = true;
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }
    
    const userRef = doc(db, 'users', auth.currentUser.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User document not found');
    }

    const userData = userDoc.data();
    const friendIds = userData.friends || [];

    const friendPromises = friendIds.map(async (friendId) => {
      const friendRef = doc(db, 'users', friendId);
      const friendDoc = await getDoc(friendRef);
      if (friendDoc.exists()) {
        const friendData = friendDoc.data();
        return {
          id: friendId,
          name: friendData.username,
          email: friendData.email,
          photoURL: friendData.photoURL || defaultAvatar.value,
          lastActive: friendData.lastActive,
          likedMovies: friendData.likedMovies || [],
          genres: friendData.genres || [],
          snackPreference: friendData.snackPreference || 'Popcorn'
        };
      }
      return null;
    });

    const friendsData = await Promise.all(friendPromises);
    friends.value = friendsData.filter(friend => friend !== null);
  } catch (err) {
    console.error('Error loading friends:', err);
    error.value = 'Failed to load friends. Please try again.';
  } finally {
    loading.value = false;
  }
};
const handleFriendAdded = async () => {
  await loadFriends();
  showAddFriendModal.value = false;
};

const handleGroupCreated = async () => {
  await loadGroups();
  showCreateGroupModal.value = false;
};

const loadGroups = async () => {
  try {
    if (!auth.currentUser) {
      throw new Error('User not authenticated');
    }

    const groupsRef = collection(db, 'groups');
    const q = query(groupsRef, where('members', 'array-contains', auth.currentUser.uid));
    const querySnapshot = await getDocs(q);

    const groupPromises = querySnapshot.docs.map(async (groupDoc) => {
      const groupData = groupDoc.data();
      const memberNames = await fetchMemberNames(groupData.members);
      return {
        id: groupDoc.id,
        name: groupData.name,
        avatar: groupData.avatar,
        members: groupData.members || [],
        memberNames: memberNames,
        moviePreferences: groupData.moviePreferences || {},
        upcomingEvents: groupData.upcomingEvents || []
      };
    });

    groups.value = await Promise.all(groupPromises);
  } catch (err) {
    console.error('Error loading groups:', err);
    error.value = 'Failed to load groups. Please try again.';
  }
};

const fetchMemberNames = async (memberIds) => {
  const memberPromises = memberIds.map(async (memberId) => {
    const memberRef = doc(db, 'users', memberId);
    const memberDoc = await getDoc(memberRef);
    if (memberDoc.exists()) {
      return memberDoc.data().username;
    }
    return null;
  });

  const memberNames = await Promise.all(memberPromises);
  return memberNames.filter(name => name !== null);
};

const loadData = async () => {
  loading.value = true;
  error.value = null;
  try {
    if  (activeTab.value === 'friends') {
      await loadFriends();
    } else {
      await loadGroups();
    }
  } catch (err) {
    error.value = `Failed to load ${activeTab.value}. Please try again.`;
  } finally {
    loading.value = false;
  }
};

const filteredItems = computed(() => {
  const items = activeTab.value === 'friends' ? friends.value : groups.value;
  return items.filter(item => {
    const name = item.name || item.username || '';
    const matchesSearch = name.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesGenres = selectedGenres.value.length === 0 || 
      (activeTab.value === 'friends' && item.genres && item.genres.some(genre => selectedGenres.value.includes(genre))) ||
      (activeTab.value === 'groups' && item.moviePreferences && item.moviePreferences.genres && 
       item.moviePreferences.genres.some(genre => selectedGenres.value.includes(genre)));
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
  loadData();
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


const formatDate = (timestamp) => {
  if (!timestamp) return 'N/A';
  return new Date(timestamp.seconds * 1000).toLocaleString();
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

const getLikedMovies = (item) => {
  if (!item.likedMovies || !Array.isArray(item.likedMovies)) return [];
  const uniqueMovies = new Set();
  return item.likedMovies
    .slice()
    .reverse()
    .filter(movie => {
      const movieName = typeof movie === 'string' ? movie : (movie?.name || movie?.title || 'Unknown Movie');
      if (!uniqueMovies.has(movieName)) {
        uniqueMovies.add(movieName);
        return true;
      }
      return false;
    })
    .slice(0, 3)
    .map(movie => typeof movie === 'string' ? movie : (movie?.name || movie?.title || 'Unknown Movie'));
};

const handleGroupNameUpdated = (newName) => {
  if (editingGroup.value) {
    const group = groups.value.find(g => g.id === editingGroup.value.id)
    if (group) {
      group.name = newName
    }
  }
  editingGroup.value = null
}

const generateRandomColor = () => {
  const hue = Math.floor(Math.random() * 360)
  return `hsl(${hue}, 70%, 60%)`
}

onMounted(() => {
  // Initialize random colors for all items
  friends.value.forEach(friend => {
    if (!friend.randomColor) {
      friend.randomColor = generateRandomColor()
    }
  })
  groups.value.forEach(group => {
    if (!group.randomColor) {
      group.randomColor = generateRandomColor()
    }
  })
})

onMounted(async () => {
  await loadFriends()
    await loadGroups()

})

const handlePhotoUpload = async (event, item) => {
  try {
    const file = event.target.files[0]
    if (!file) return
    
    // Optional: Add loading state
    item.isUploading = true
    
    const photoURL = await uploadGroupPhoto(file, item.id)
    
    // Update local state
    item.photoURL = photoURL
    
  } catch (error) {
    console.error('Failed to upload photo:', error)
  } finally {
    item.isUploading = false
    // Clear the input
    event.target.value = ''
  }
}

const handleImageClick = (item) => {
  if (activeTab.value === 'groups') {
    // Create a temporary file input
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => handlePhotoUpload(e, item)
    input.click()
  }
}

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

/* Add these animations to your existing style section */
@keyframes pulse-attention {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    transform: scale(1);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
    transform: scale(1);
  }
}

.pulse-button {
  animation: pulse-attention 2s infinite;
}

.attention-text {
  position: absolute;
  right: -120px;
  top: 50%;
  transform: translateY(-50%);
  color: #60A5FA;
  font-size: 0.9em;
  animation: bounce 1s infinite;
  white-space: nowrap;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-50%) translateX(0);
  }
  50% {
    transform: translateY(-50%) translateX(-10px);
  }
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}

@keyframes expand {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.wiggle-animation {
  animation: wiggle 0.5s ease-in-out;
}

.expand-animation {
  animation: expand 0.5s ease-in-out;
}

.avatar-container {
  transition: all 0.3s ease;
}

.avatar-container:active {
  transform: scale(0.95);
}
</style>