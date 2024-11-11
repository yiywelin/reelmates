<template>
  <div class="main-content">
    <NavBar class="z-10" />
    <TheatricalBackground class="z-0 fixed inset-0 w-full h-full" />
    <div class="flex flex-col md:flex-row w-full h-full text-white z-10 relative mt-16">

      <!-- Left Panel - hidden on mobile -->
      <div class="hidden md:block full-height bg-[#2E2A4F]">
        <div class="left-panel flex-shrink-0 text-white flex flex-col p-4">
          <!-- Profile Section -->
          <div v-if="currentUser" class="flex flex-col space-y-6">
            <div class="profile-section hover:bg-[#3B365F] rounded-lg p-2 transition-colors cursor-pointer">
              <div class="flex items-center space-x-3">
                <span class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl">
                  {{ currentUser.email[0].toUpperCase() }}
                </span>
                <span class="font-medium">{{ currentUser.email.split('@')[0].charAt(0).toUpperCase() + 
                  currentUser.email.split('@')[0].slice(1) }}</span>
              </div>
            </div>

            <!-- Friends Section -->
            <div class="friends-section">
              <div class="flex items-center mb-3 px-2">
                <h2 class="text-pink-500 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  Friends
                </h2>
              </div>

              <div class="space-y-2">
                <div v-for="friend in friendsData.slice(0, 2)" :key="friend.id" 
                    class="flex items-center space-x-3 p-2 hover:bg-[#3B365F] rounded-lg transition-colors cursor-pointer">
                  <div class="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <span class="text-white text-sm">{{ friend.email[0].toUpperCase() }}</span>
                  </div>
                  <span class="text-sm">{{ friend.name }}</span>
                </div>

                <router-link 
                  to="/friends" 
                  class="block text-sm text-pink-400 hover:text-pink-300 mt-2 px-2"
                >
                  See all friends
                </router-link>
              </div>
            </div>

            <!-- Groups Section -->
            <div class="groups-section mt-4">
              <div class="flex items-center mb-3 px-2">
                <h2 class="text-pink-500 font-medium flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h-2v-2h2zm-3 0v2H8v-2h4zm-5 0v2H5v-2h2zm-3-3h2v2H4v-2zm3 0h4v2H7v-2zm5 0h2v2h-2v-2zm3-3h2v2h-2V7zm-3 0h2v2h-2V7zm-5 0h4v2H7V7zm-3 0h2v2H4V7z" clip-rule="evenodd" />
                  </svg>
                  Groups
                </h2>
              </div>

              <div class="space-y-2">
                <div v-for="group in groups" :key="group.id"
                    class="flex items-center space-x-3 p-2 hover:bg-[#3B365F] rounded-lg transition-colors cursor-pointer">
                  <img 
                    :src="defaultAvatar" 
                    :alt="group.name"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                  <span class="text-sm">{{ group.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel - full width on mobile -->
      <div class="right-panel flex-grow px-4 md:px-5 md:ml-60 w-full md:w-auto">
        <div>

          <div class="text-center mb-12 animate-fadeIn mt-12">
            <span class="text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] mb-2 text-[#DB3DCF] 
            [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF] 
            animate-neonFlicker">
              {{ 'Recently Liked Movies' }}
            </span>
          </div>
          <div class="flex">

          </div>

          <div ref="yourLikesContainer" class="your-likes-container scroll-container flex">
            <div v-if="moviesCards.length > 0">
              <!-- Desktop View (>768px) -->
              <div v-if="windowWidth > 768" class="flex overflow-x-auto">
                <div v-for="movie in moviesCards" :key="movie.id"
                  class="your-likes-card inline-block rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-3 group">
                  <!-- Your existing card content -->
                  <div class="relative pb-[150%]">
                    <img
                      :src="movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/placeholder-movie.jpg'"
                      :alt="movie.title"
                      class="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-135 group-hover:shadow-2xl" />
                    <div
                      class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[rgba(10,10,31,0.95)] via-[rgba(10,10,31,0.7)] to-transparent rounded-b-lg translate-y-full transition-transform duration-300 group-hover:translate-y-[-45%]">
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

              <!-- Mobile View (≤768px) -->
              <div v-else class="flex flex-col w-full gap-4">
                <div v-for="movie in moviesCards" :key="movie.id"
                  class="your-likes-card w-full rounded-lg cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:-translate-y-3 group">
                  <!-- Your existing card content -->
                  <div class="relative pb-[150%]">
                    <img
                      :src="movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : '/placeholder-movie.jpg'"
                      :alt="movie.title"
                      class="absolute inset-0 w-full h-full object-cover rounded-lg transition-all duration-300 group-hover:scale-135 group-hover:shadow-2xl" />
                    <div
                      class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[rgba(10,10,31,0.95)] via-[rgba(10,10,31,0.7)] to-transparent rounded-b-lg translate-y-full transition-transform duration-300 group-hover:translate-y-[-40%]">
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

            <div v-else class="flex justify-center">
              <div class="text-center mb-12 animate-fadeIn mt-12">
                <span class="text-lg font-semibold text-[#FF6961] 
            [text-shadow:0_0_5px_#DB3DCF,0_0_10px_#DB3DCF,0_0_20px_#DB3DCF] 
            block" style="word-wrap: break-word; overflow-wrap: break-word;">
                  {{ "You haven't liked any movies yet. Swipe more movies!" }}
                </span>
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
    loadUserMovieHistory();

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

const loadUserMovieHistory = async () => {
  if (!auth.currentUser) return

  try {
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      const userDataLength = userData.likedMovies.length
      moviesCards.value = userData.likedMovies.slice(userDataLength - 10, userDataLength).reverse() || []
      // console.log(moviesCards);
    }
  } catch (err) {
    console.error('Error loading movie history:', err)
  }
}


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

const yourLikesContainer = ref(null);
let yourLikesScrollInterval;

const startyourLikesScrolling = () => {
  if (windowWidth.value > 768) {
    yourLikesScrollInterval = setInterval(() => {
      if (yourLikesContainer.value) {
        yourLikesContainer.value.scrollBy({
          left: 1,
          behavior: 'smooth',
        });
        if (yourLikesContainer.value.scrollLeft >= yourLikesContainer.value.scrollWidth - yourLikesContainer.value.clientWidth) {
          yourLikesContainer.value.scrollLeft = 0;
        }
      }
    }, 30);
  }
};

const stopYourLikesScrolling = () => {
  clearInterval(yourLikesScrollInterval);
};

onMounted(() => {
  initDragScroll('.scroll-container');
  yourLikesContainer.value = document.querySelector('.your-likes-container');
  startyourLikesScrolling();


  const yourLikes = yourLikesContainer.value;
  if (yourLikes) {
    yourLikes.addEventListener('mouseover', stopYourLikesScrolling);
    yourLikes.addEventListener('mouseleave', startyourLikesScrolling);
  }
});

onBeforeUnmount(() => {
  stopYourLikesScrolling();

  const yourLikes = yourLikesContainer.value;
  if (yourLikes) {
    yourLikes.removeEventListener('mouseover', stopYourLikesScrolling);
    yourLikes.removeEventListener('mouseleave', startyourLikesScrolling);
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

.your-likes-container {
  display: flex;
  gap: 2px;
  align-items: flex-start;
  user-select: none;
}

.your-likes-card {
  flex: 1 1 80%;
  min-width: 200px;
  max-width: 300px;
  max-height: 250px;
  transition: transform 0.3s ease-in-out;
  margin-right: 3px;
}

.your-likes-card:hover {
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

/* Glow effect on hover */
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
    width: 100%;
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

  .your-likes-container {
    flex-direction: column;
    gap: 1.5rem;
    align-items: center;
    margin-bottom: 8px;
    width: 100%;
    /* Add this */
  }

  .your-likes-card {
    min-width: 190px;
    height: 500px;
    margin-right: 10px;
    display: inline-block;
  }

  .your-likes-card:hover {
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
