<template>
  <div id="app">
    <div v-if="initializing" class="loading-screen">
      <!-- can replace this with a nice loading animation -->
      <div class="loading-content">
        <div class="spinner"></div>
        <p class="loading-text">Loading...</p>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { auth } from "./firebaseConfig";
import { useRouter } from 'vue-router';

export default {
  name: "App",
  setup() {
    const router = useRouter();
    const initializing = ref(true);

    onMounted(() => {
      // Set up authentication state observer
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log("Auth state changed:", user ? "User logged in" : "No user");
        
        if (user) {
          // If user is authenticated and trying to access auth pages
          if (router.currentRoute.value.path === '/login' || 
              router.currentRoute.value.path === '/register') {
            router.push('/home');
          }
        } else {
          // If no user and trying to access protected routes
          if (router.currentRoute.value.meta.requiresAuth) {
            router.push('/login');
          }
        }
        
        // Remove loading screen
        initializing.value = false;
      });

      // Cleanup subscriber on unmount
      return () => unsubscribe();
    });

    return {
      initializing
    };
  }
};
</script>

<style scoped>
.loading-screen {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-text {
  color: white;
  font-size: 1.2rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #675FF2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
