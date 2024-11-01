// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebaseConfig';
import HomePage from '../views/HomePage.vue';
import RegisterForm from '../components/UserLogin/RegisterForm.vue';
<<<<<<< Updated upstream
import LoginForm from '../components/UserLogin/LoginForm.vue'
import MovieSwiper from '../components/MovieSwiper/MovieSwiper.vue' 
import EnhancedFriendsPage from '../components/friends/EnhancedFriendsPage.vue'
=======
import LoginForm from '../components/UserLogin/LoginForm.vue';
import MovieSwiper from '../components/MovieSwiper/MovieSwiper.vue';
import WatchParty from '../components/WatchParty/WatchParty.vue';
import MovieRoulette from '@/components/MovieRoulette/MovieRoulette.vue';
// import MovieRoulette from '../components/MovieRoulette/MovieRoulette.vue';
>>>>>>> Stashed changes

// Define routes
const routes = [
  {
    path: '/',
    redirect: '/register'
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/swipe',
    name: 'MovieSwiper',
    component: MovieSwiper,
    meta: { requiresAuth: true }
  },
  {
<<<<<<< Updated upstream
    path: '/friends',
    name: 'Friends',
    component: EnhancedFriendsPage,
    meta: { requiresAuth: true }
=======
    path: '/watch-party',
    name: 'WatchParty',
    component: WatchParty,
    meta: { requiresAuth: true }
  },
  {
    path: '/movie-roulette', // New route path for MovieRoulette
    name: 'MovieRoulette',
    component: MovieRoulette,
    meta: { requiresAuth: true } // Optional auth requirement
>>>>>>> Stashed changes
  }
];

// Create a new router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;