<template>
  <div class="main-content">
    <NavBar class="z-10" />
    <TheatricalBackground class="z-0 fixed inset-0 w-full h-full" />
    <div class="flex flex-col md:flex-row w-full h-full text-white z-10 relative mt-16">

      <!-- Left Panel - hidden on mobile -->
      <div class="hidden md:block full-height bg-[#3f2763]">
        <div class="left-panel flex-shrink-0 text-white flex flex-col items-center p-4">
          <div v-if="currentUser">
            <div class="user-info flex items-center gap-2">
              <div class="flex items-center">
                <span
                  class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-glow">
                  {{ currentUser.email[0].toUpperCase() }}
                </span>
                <span class="user-name font-bold ml-2">{{ currentUser.email.split('@')[0].charAt(0).toUpperCase() +
                  currentUser.email.split('@')[0].slice(1) }}</span>
              </div>
            </div>
            <hr class="custom-hr w-full mt-4" />
            <div class="friends-info flex items-center gap-2">
              <h2 class="friends-title font-semibold text-[#FF6961] animate-neonFlicker 
            [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF] -mt-3 -mb-8">Friends</h2>
              <div v-if="friendsData && friendsData.length > 0">
                <div v-for="friend in friendsData.slice(0, 2)" :key="friend.id" class="friend-item -mt-5">
                  <div
                    class="w-10 h-10 mr-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-glow">
                    {{ friend.email[0].toUpperCase() }}
                  </div>
                  <span class="friend-name">{{ friend.name.split('@')[0].charAt(0).toUpperCase() +
                    friend.name.split('@')[0].slice(1) }}</span>
                </div>
                <div v-if="friendsData.length > 2" class="text-sm text-right">
                  And more...
                </div>
              </div>
              <div v-else>
                No friends
              </div>

              <hr class="custom-hr w-full mt-4" />
              <h2 class="friends-title font-semibold text-[#FF6961] animate-neonFlicker 
            [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF] -mt-3 -mb-8">Groups</h2>
              <div v-if="groups && groups.length > 0">
                <div v-for="group of groups.slice(0)" :key="group.id" class="friend-item -mt-5">
                  <a :href="group.avatar" target="_blank" rel="noopener noreferrer">
                    <img :src="defaultAvatar" alt="Group Avatar"
                      class="w-10 h-10 mr-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-glow">
                  </a>
                  <span class="friend-name">{{ group.name }}</span>
                </div>
                <div v-if="groups.length > 3" class="text-sm text-right">
                  And more...
                </div>
              </div>
              <div v-else>
                No groups
              </div>
              <div class="text-right mt-2">
                <router-link to="/friends">
                  <button class="button-friends bg-gradient-to-r from-purple-500 to-pink-500 font-bold">View more!
                    &gt;</button>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - full width on mobile -->
      <div class="right-panel flex-grow px-4 md:px-5 md:ml-60 w-full md:w-auto">
        <div>

          <div class="text-center mb-16 animate-fadeIn mt-1">
            <span class="text-xl md:text-3xl lg:text-4xl font-semibold text-[#FF6961] animate-neonFlicker 
            [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF]">
              {{ 'Trending Movies' }}
            </span>
          </div>
          <div class="-mb-12"></div>
          <div class="flex">

          </div>

          <div ref="scrollContainer" class="movies-container scroll-container flex whitespace-nowrap">
            <div v-for="movie in movies" :key="movie.id"
              class="movie-card inline-block rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-3 group">
              <div class="relative pb-[150%]">
                <img
                  :src="movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/placeholder-movie.jpg'"
                  :alt="movie.title"
                  class="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-135 group-hover:shadow-2xl" />
                <div
                  class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[rgba(10,10,31,0.95)] via-[rgba(10,10,31,0.7)] to-transparent rounded-b-lg translate-y-full transition-transform duration-300 group-hover:translate-y-[-20%]">
                  <h3 class="text-md font-semibold text-white m-0 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]"
                    style="width: 100%; word-wrap: break-word; white-space: normal;">
                    {{ movie.title }}
                  </h3>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="text-yellow-400">★</span>
                    <span class="text-white">{{ movie.rating ? `${movie.rating.toFixed(1)}/10` : 'N/A' }}</span>
                    <span v-if="movie.basedOn" class="text-sm text-gray-400">
                      (Similar to {{ movie.basedOn }})
                    </span>
                  </div>
                  <div
                    class="mt-2 opacity-0 translate-y-5 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="text-right mt-2">
            <router-link to="/friends">
              <button class="view-more-button">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-people-fill" viewBox="0 0 16 16">
                  <path
                    d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                </svg>
              </button>
            </router-link>
          </div>

          <!-- For You Section -->
          <div class="text-center mb-16 animate-fadeIn mt-2">
            <span class="text-xl md:text-3xl lg:text-4xl font-semibold text-[#FF6961] animate-neonFlicker 
  [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF]">
              {{ 'For You' }}
            </span>
          </div>
          <div class="-mb-12"></div>
          <div ref="forYouContainer" class="for-you-container scroll-container flex whitespace-nowrap">
            <div v-for="movie in moviesCards" :key="movie.id"
              class="for-you-card inline-block rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-3 group">
              <div class="relative pb-[56.25%]">
                <img
                  :src="movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/placeholder-movie.jpg'"
                  :alt="movie.title"
                  class="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-135 group-hover:shadow-2xl" />
                <div
                  class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[rgba(10,10,31,0.95)] via-[rgba(10,10,31,0.7)] to-transparent rounded-b-lg translate-y-full transition-transform duration-300 group-hover:translate-y-[3%] movie-details">
                  <h3 class="text-md font-semibold text-white m-0 [text-shadow:0_2px_4px_rgba(0,0,0,0.3)]"
                    style="width: 100%; word-wrap: break-word; white-space: normal;">
                    {{ movie.title }}
                  </h3>
                  <div class="flex items-center gap-1 mt-1">
                    <span class="text-yellow-400">★</span>
                    <span class="text-white">{{ movie.rating ? `${movie.rating.toFixed(1)}/10` : 'N/A' }}</span>
                    <span v-if="movie.basedOn" class="text-sm text-gray-400">
                      (Similar to {{ movie.basedOn }})
                    </span>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import TheatricalBackground from '../components/Backgrounds/TheatricalBackground.vue';
import NavBar from '../components/ui/NavBar.vue';
import tmdbService from '../services/tmdbService';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebaseConfig';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import defaultAvatar from '@/assets/images/default-avatar.png';

const movies = ref([]);
const moviesCards = ref([]);
const currentUser = ref(null);
const friendsData = ref([]);
const groups = ref([]);
const error = ref(null);
const windowWidth = ref(window.innerWidth);

// Update window width on resize
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(async () => {
  window.addEventListener('resize', handleResize);
  if (windowWidth.value <= 768) {
    const rightPanel = document.querySelector('.right-panel');
    rightPanel.addEventListener('wheel', (e) => {
      e.preventDefault();
      rightPanel.scrollTop += e.deltaY; // Scroll vertically
    });
  }

  try {
    const popularMovies = await tmdbService.getPopularMovies(1);
    movies.value = popularMovies.slice(8, 18);

    loadGroups();

    const moviesCardsValue = await tmdbService.getMoviesByGenre([14, 53]);
    moviesCards.value = moviesCardsValue.slice(0, 10);
    // console.log(moviesCards);

    onAuthStateChanged(auth, async (user) => {
      currentUser.value = user;
      if (user) { // Ensure user is authenticated

        const userRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          console.error("No such user document!");
          return;
        }

        const userData = userDoc.data();
        const friendIds = userData.friends || [];
        // console.log('Friend IDs:', friendIds);

        friendsData.value = await Promise.all(
          friendIds.map(async (friendId) => {
            try {
              const friendRef = doc(db, 'users', friendId);
              const friendDoc = await getDoc(friendRef);
              if (friendDoc.exists()) {
                const friendData = friendDoc.data();
                return {
                  id: friendId,
                  name: friendData.username,
                  email: friendData.email,
                  photoURL: friendData.photoURL,
                  lastActive: friendData.lastActive,
                  likedMovies: friendData.likedMovies,
                  genres: friendData.genres,
                  snackPreference: friendData.snackPreference || 'Popcorn',
                };
              }
            } catch (error) {
              console.error(`Error fetching friend data for ${friendId}:`, error);
            }
            return null;
          })
        );
      }
    }
    );

  } catch (error) {
    console.error('Failed to fetch movies:', error);
  }
});


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
        members: groupData.members,
        memberNames: memberNames,
        moviePreferences: groupData.moviePreferences,
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

const initDragScroll = (selector) => {
  const containers = document.querySelectorAll(selector);

  containers.forEach(container => {
    let isDown = false;
    let startX;
    let scrollLeft;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // The multiplier controls the scroll speed
      container.scrollLeft = scrollLeft - walk;
    });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      container.scrollLeft += e.deltaY;
    });
  });
};

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
  const rightPanel = document.querySelector('.right-panel');
  if (rightPanel) {
    rightPanel.removeEventListener('wheel', scrollHandler);
  }
});

// Handler for scrolling on the right panel
const scrollHandler = (e) => {
  e.preventDefault();
  const rightPanel = document.querySelector('.right-panel');
  rightPanel.scrollTop += e.deltaY; // Adjust the vertical scroll
};

onMounted(() => {
  initDragScroll('.scroll-container');
});

const scrollContainer = ref(null);
const forYouContainer = ref(null);
let scrollInterval;
let forYouScrollInterval;

const startScrolling = () => {
  if (windowWidth.value > 768) {
    scrollInterval = setInterval(() => {
      if (scrollContainer.value) {
        // Smooth scroll by a small amount
        scrollContainer.value.scrollBy({
          left: 1,
          behavior: 'auto', // Change to 'auto' for immediate effect
        });

        // Check if the scroll has reached the end
        if (scrollContainer.value.scrollLeft >= scrollContainer.value.scrollWidth - scrollContainer.value.clientWidth) {
          scrollContainer.value.scrollLeft = 0;
        }
      }
    }, 50); // Adjust the interval as necessary
  }
};

const stopScrolling = () => {
  clearInterval(scrollInterval);
};

const startForYouScrolling = () => {
  if (windowWidth.value > 768) {
    forYouScrollInterval = setInterval(() => {
      if (forYouContainer.value) {
        forYouContainer.value.scrollBy({
          left: 1,
          behavior: 'smooth',
        });
        if (forYouContainer.value.scrollLeft >= forYouContainer.value.scrollWidth - forYouContainer.value.clientWidth) {
          forYouContainer.value.scrollLeft = 0;
        }
      }
    }, 5);
  }
};

const stopForYouScrolling = () => {
  clearInterval(forYouScrollInterval);
};

onMounted(() => {
  scrollContainer.value = document.querySelector('.movies-container');
  forYouContainer.value = document.querySelector('.for-you-container');

  startScrolling();
  startForYouScrolling();

  // Add hover event listeners to stop scrolling for both containers
  const container = scrollContainer.value;
  if (container) {
    container.addEventListener('mouseover', stopScrolling);
    container.addEventListener('mouseleave', startScrolling);
  }

  const forYou = forYouContainer.value;
  if (forYou) {
    forYou.addEventListener('mouseover', stopForYouScrolling);
    forYou.addEventListener('mouseleave', startForYouScrolling);
  }
});

onBeforeUnmount(() => {
  stopScrolling();
  stopForYouScrolling();

  const container = scrollContainer.value;
  if (container) {
    container.removeEventListener('mouseover', stopScrolling);
    container.removeEventListener('mouseleave', startScrolling);
  }

  const forYou = forYouContainer.value;
  if (forYou) {
    forYou.removeEventListener('mouseover', stopForYouScrolling);
    forYou.removeEventListener('mouseleave', startForYouScrolling);
  }
});

</script>

<style scoped>
.main-content {
  overflow-y: auto;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scroll-container {
  overflow-x: auto;
  white-space: nowrap;
  padding: 0 1rem;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.movies-container {
  display: flex;
  gap: 2px;
  align-items: flex-start;
  user-select: none;
}

.for-you-container {
  display: flex;
  gap: 1px;
  align-items: flex-start;
  user-select: none;
}

.for-you-card {
  flex: 0 0 200px;
  /* Adjust this value for desired width */
  height: 100%;
  /* Adjust this value for desired height */
  transition: transform 0.3s ease-in-out;
}

.for-you-card:hover {
  transform: translateY(-5px);
  /* Slight lift effect on hover */
}

.movie-card {
  min-width: 200px; 
  height: 270px; 
  margin-right: 10px; 
  display: inline-block; 
}

.movie-card:hover {
  transform: translateY(-5px);
}

.full-height {
  height: auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.left-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 16.67%;
  max-width: 220px;
  min-width: 120px;
  height: 100%;
  transition: width 0.3s;
  padding: 16px;
  background-color: rgba(103, 95, 242, 0.5);
  z-index: 10;
}

.right-panel {
  width: 83.33%;
  height: auto;
  max-height: calc(100vh - 16px);
  overflow-y: auto;
  transition: width 0.3s;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

.friend-item {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.friend-name {
  font-size: 16px;
}

.button-friends {
  margin-top: 2px;
  border-radius: 15px;
  padding: 10px;
  font-size: 12px;
  background-color: #4a4a4a;
  color: white;
  border: none;
  transition: box-shadow 0.3s ease;
}

.button-friends:hover {
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5),
    0 0 10px rgba(255, 255, 255, 0.3);
}

.view-more-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background-color: rgb(118, 105, 29);
  color: white;
  padding: 20px 20px;
  border-radius: 50%;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;

  box-shadow: 0 0 10px rgba(255, 255, 0, 0.6),
    0 0 20px rgba(255, 255, 0, 0.6),
    0 0 30px rgba(255, 255, 0, 0.6);
}


.view-more-button:hover {
  box-shadow: 0 0 20px rgba(255, 255, 0, 1),
    0 0 30px rgba(255, 255, 0, 1),
    0 0 40px rgba(255, 255, 0, 1);
}


.bi-people-fill {
  width: 35px;
  height: 35px;
}

.custom-hr {
  border: none;
  height: 2px;
  background-color: white;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 80px;
}

.friends-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 10px;
  z-index: 5;
}

.friends-title {
  font-weight: bold;
  font-size: 1.2rem;
  margin: 1rem 0;
  text-align: center;
}

.username {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
}

.cards,
.cards * {
  user-select: none;
}

.cards {
  transition: transform 0.3s ease;
}

.cards:hover {
  transform: scale(1.05);
  opacity: 1;
  box-shadow: 0 0 20px #675FF2;
}

.movie-image {
  background-color: #555;
  height: 280px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  aspect-ratio: 2/3;
}

.movie-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header {
  margin-bottom: 20px;
}

/* Responsiveness */
@media (max-width: 768px) {
  .left-panel {
    display: none;
  }

  .right-panel {
    margin-left: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    scrollbar-width: none;
    padding-left: 100px;
    padding-bottom: 80px;
  }

  .right-panel::-webkit-scrollbar {
    display: none;
  }

  .cards {
    width: 100%;
    margin-bottom: 1.5rem;
    display: flex;
    justify-content: center;
  }

  .movie-image {
    max-height: none;
    width: 100%;
  }

  .movies-container {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
  }

  .for-you-container {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    margin-bottom: 8px;
  }

  .for-you-card {
    flex: 1 1 80%;
    min-width: 200px;
    max-width: 300px;
    max-height: 250px;
    transition: transform 0.3s ease-in-out;
  }

  .for-you-card:hover {
    transform: translateY(-5px);
  }

  .header {
    font-size: 21px;
  }

  .view-more-button {
    padding: 10px 10px;
  }

  .bi-people-fill {
    width: 25px;
    height: 25px;
  }

}
</style>
