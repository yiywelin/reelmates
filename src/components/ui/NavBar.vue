<template>
  <nav class="navbar">
    <div class="nav-content">
      <!-- Logo Section -->
      <router-link to="/home" class="logo-section">
        <img src="@/assets/images/Reelmates_Logo.png" alt="Reelmates" class="logo-image" />
      </router-link>

      <!-- Hamburger Menu Button -->
      <button class="mobile-menu-button" @click="toggleMobileMenu" aria-label="Toggle menu">
        <div class="hamburger-icon" :class="{ 'open': isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <!-- Navigation Links -->
      <div class="nav-links" :class="{ 'mobile-open': isMobileMenuOpen }">
        <router-link 
          v-for="link in navLinks" 
          :key="link.path"
          :to="link.path"
          class="nav-link"
          active-class="active"
          @click="isMobileMenuOpen = false"
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
            <router-link to="/profile" class="menu-item" @click="closeAllMenus">Profile</router-link>
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { authService } from '@/services/authService';

const router = useRouter();
const currentUser = ref(null);
const isMenuOpen = ref(false);
const isMobileMenuOpen = ref(false);

const navLinks = [
  { name: 'Home', path: '/home' },
  { name: 'Swipe Movies', path: '/select-genre' },
  { name: 'Watch with Friends', path: '/friends' },
  { name: 'Active Watch Party', path: '/watch-party' },
  { name: 'About Us', path: '/meet-the-team' }
];

onMounted(() => {
  onAuthStateChanged(auth, (user) => {
    currentUser.value = user;
  });
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

const handleResize = () => {
  if (window.innerWidth > 768) {
    isMobileMenuOpen.value = false;
  }
};

const handleSignOut = async () => {
  const result = await authService.logout();
  if (result.success) {
    closeAllMenus();
    router.push('/login');
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeAllMenus = () => {
  isMenuOpen.value = false;
  isMobileMenuOpen.value = false;
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
  height: 70px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* Creates 3 equal columns */
  align-items: center;
}

/* Logo Styles */
.logo-section {
  display: flex;
  align-items: center;
  text-decoration: none;
  z-index: 101;
}

.logo-image {
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(103, 95, 242, 0.3));
}

/* Mobile Menu Button */
.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.hamburger-icon {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background: #D0CCE3;
  transition: all 0.3s ease;
}

.hamburger-icon.open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.hamburger-icon.open span:nth-child(2) {
  opacity: 0;
}

.hamburger-icon.open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
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
  z-index: 102;
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

/* Responsive Styles */
@media (max-width: 768px) {
  .nav-content {
    padding: 0 1rem;
  }

  .logo-section {
    grid-column: 1;
    justify-self: start;
  }

  .mobile-menu-button {
    display: block;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    flex-direction: column;
    padding: 5rem 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0.5rem;
  }

  .nav-links.mobile-open {
    transform: translateX(0);
  }

  .nav-link {
    width: 100%;
    text-align: center;
    background-color: #1A1A33;
    border-radius: 8px;
    font-size: 1.25rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
    text-shadow: 0 0 10px rgba(219, 61, 207, 0.3);
    transition: all 0.3s ease;
    z-index: 99;
  }

  .nav-link:hover,
  .nav-link.active {
    background: #1A1A33; /* Even lighter background for hover/active */
    color: #DB3DCF;
    text-shadow: 
      0 0 10px rgba(219, 61, 207, 0.8),
      0 0 20px rgba(219, 61, 207, 0.4);
  }

  .nav-link.active {
    background: #1A1A33;
    color: #DB3DCF;
  }

  .link-indicator {
    display: none;
  }

  .user-name {
    display: none;
  }

  .logo-image {
    height: 32px;
  }

  .mobile-menu-button {
    grid-column: 2;
    justify-self: center; /* Center the hamburger menu */
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    height: 70px;
    padding: 0;
  }

  .mobile-menu-button .hamburger-icon span {
    background: #DB3DCF;
    height: 2px;
    border-radius: 2px;
  }

  .user-section {
    grid-column: 3;
    justify-self: end;
  }
}

/* Animation for menu items */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.nav-links.mobile-open .nav-link {
  animation: fadeIn 0.3s ease forwards;
  animation-delay: calc(var(--index) * 0.1s);
}
</style>
