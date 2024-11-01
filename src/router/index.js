// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebaseConfig'
import HomePage from '../views/HomePage.vue';
import RegisterForm from '../components/UserLogin/RegisterForm.vue';
import LoginForm from '../components/UserLogin/LoginForm.vue'
import MovieSwiper from '../components/MovieSwiper/MovieSwiper.vue' 
import EnhancedFriendsPage from '../components/friends/EnhancedFriendsPage.vue'

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
  },
  {
    path: '/swipe',
    name: 'MovieSwiper',
    component: MovieSwiper
  },
  {
    path: '/friends',
    name: 'Friends',
    component: EnhancedFriendsPage,
    meta: { requiresAuth: true }
  }
];

// Create a new router instance
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Navigation guard to check authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const currentUser = auth.currentUser

  if (requiresAuth && !currentUser) {
    next('/login')
  } else {
    next()
  }
})

export default router;