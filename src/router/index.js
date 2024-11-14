// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebaseConfig';
import HomePage from '../views/HomePage.vue';
import SelectGenre from '../views/SelectGenre.vue';
import RegisterForm from '../components/UserLogin/RegisterForm.vue';
import LoginForm from '../components/UserLogin/LoginForm.vue';
import MovieSwiper from '../components/MovieSwiper/MovieSwiper.vue';
import UserProfile from '../views/UserProfile.vue';
import EnhancedFriendsPage from '@/components/Friends/EnhancedFriendsPage.vue';
import WatchParty from '../components/WatchParty/WatchParty.vue';
import MovieRoulette from '@/components/MovieRoulette/MovieRoulette.vue';
import MeetTheTeam from '@/views/MeetTheTeam.vue';
import RecommendationsPage from '../views/RecommendationsPage.vue';


const routes = [
  {
    path: '/',
    redirect: '/home'
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
    path: '/select-genre',
    name: 'SelectGenre',
    component: SelectGenre,
    meta: { requiresAuth: true }
  },
  {
    path: '/swipe',
    name: 'MovieSwiper',
    component: MovieSwiper,
    meta: { requiresAuth: true }
  },
  {
    path: '/recommendations/:groupId/:chatId',
    name: 'recommendations',
    component: RecommendationsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/friends',
    name: 'Friends',
    component: EnhancedFriendsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/watch-party',
    name: 'WatchParty',
    component: WatchParty,
    meta: { requiresAuth: true }
  },
  {
    path: '/movie-roulette/:groupId/:chatId',
    name: 'MovieRoulette',
    component: MovieRoulette,
    meta: { requiresAuth: true }
  },
  {
    path: '/meet-the-team',
    name: 'MeetTheTeam',
    component: MeetTheTeam,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'UserProfile',
    component: UserProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/loading',
    name: 'LoadingScreen',
    component: () => import('@/components/ui/LoadingPage.vue'),
    props: true
  },
  {
    path: '/watch-party',
    name: 'WatchParty',
    component: () => import('@/components/WatchParty/WatchParty.vue'),
    props: route => ({
      movieTitle: route.params.movieTitle,
      movieTrailerId: route.params.movieTrailerId,
      movieId: route.params.movieId
    })
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !auth.currentUser) {
    next('/login');
  } else {
    next();
  }
});

export default router;
