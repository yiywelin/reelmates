<template>
  <nav class="navbar">
    <div class="nav-content">
      <!-- Logo Section -->
      <router-link to="/home" class="logo-section">
        <img src="@/assets/images/Reelmates_Logo.png" alt="Reelmates" class="logo-image" />
      </router-link>

      <!-- Navigation Links -->
      <div class="nav-links">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link"
          active-class="active"
        >
          <span class="link-text">{{ link.name }}</span>
          <div class="link-indicator"></div>
        </router-link>
      </div>

      <!-- User Section -->
      <div class="user-section">
        <div v-if="currentUser" class="user-menu">
          <!-- User Info -->
          <div class="user-info" @click="toggleMenu">
            <div class="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-2xl animate-glow">
                {{ currentUser.email[0].toUpperCase() }}
            </div>
            <span class="user-name">{{ currentUser.displayName || currentUser.email }}</span>
          </div>

          <!-- Dropdown Menu -->
          <div v-if="isMenuOpen" class="dropdown-menu">
            <router-link to="/profile" class="menu-item">Profile</router-link>
            <router-link to="/friends" class="menu-item">Friends</router-link>
            <button @click="handleSignOut" class="menu-item logout">
              Sign Out
            </button>
          </div>
        </div>

        <!-- Login Button for non-authenticated users -->
        <router-link v-else to="/login" class="login-button">
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from '@/services/authService';

const router = useRouter();
const currentUser = ref(null);
const isMenuOpen = ref(false);

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Swipe Movies', path: '/swipe' },
  { name: 'Recommendations', path: '/recommendations' },
  { name: 'Movie Roulette', path: '/movie-roulette' },
  { name: 'Watch Party', path: '/watch-party' },
  { name: 'Meet the Team', path: '/meet-the-team' },
];

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
});

const handleSignOut = async () => {
  const result = await authService.logout();
  if (result.success) {
    router.push('/login');
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: rgba(10, 10, 31, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  border-bottom: 1px solid rgba(103, 95, 242, 0.1);
}

.nav-content {
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo Styles */
.logo-section {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-image {
  height: 45px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(103, 95, 242, 0.3));
}

/* Navigation Links */
.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  position: relative;
  color: #D0CCE3;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  transition: all 0.3s ease;
}

.link-indicator {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #675FF2, #DB3DCF);
  transition: width 0.3s ease;
}

.nav-link:hover .link-indicator,
.nav-link.active .link-indicator {
  width: 100%;
}

.nav-link:hover {
  color: white;
}

/* User Section */
.user-section {
  position: relative;
}

.user-menu {
  position: relative;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user-info:hover {
  background: rgba(103, 95, 242, 0.1);
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.5); }
  50% { box-shadow: 0 0 30px rgba(168, 85, 247, 0.8); }
}

.animate-glow {
  animation: glow 2s ease-in-out infinite;
}

.user-name {
  color: #D0CCE3;
  font-weight: 500;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background: rgba(10, 10, 31, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  border: 1px solid rgba(103, 95, 242, 0.2);
  padding: 0.5rem;
  animation: fadeIn 0.2s ease-out;
}

.menu-item {
  display: block;
  padding: 0.8rem 1rem;
  color: #D0CCE3;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
}

.menu-item:hover {
  background: rgba(103, 95, 242, 0.1);
  color: white;
}

.logout {
  color: #DB3DCF;
}

.logout:hover {
  background: rgba(219, 61, 207, 0.1);
}

.login-button {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(45deg, #675FF2, #DB3DCF);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 15px rgba(103, 95, 242, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .nav-links {
    display: none; /* Hide navigation links on mobile */
  }

  .user-name {
    display: none; /* Hide username on mobile */
  }

  .logo-image {
    height: 24px;
  }
}
</style>