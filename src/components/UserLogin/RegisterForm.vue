<template>
  <div class="h-screen w-full flex">
    <!-- Left Side - Feature Carousel -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-[#0a0a1f] overflow-hidden">
      <!-- Carousel Container -->
      <div class="feature-carousel relative h-full w-full">
        <!-- Main Slide Content -->
      <div v-for="(slide, index) in allSlides" 
          :key="slide.id"
          v-show="currentSlide === index"
          class="absolute inset-0 transition-opacity duration-500"
          :class="{ 'opacity-0': currentSlide !== index }">
        
        <!-- Common Background for All Slides -->
        <img 
          src="@/assets/images/moviePoster2.jpg" 
          alt="Background" 
          class="w-full h-full object-cover"
        />
        <!-- Gradient Overlay for Better Readability -->
        <div class="absolute inset-0 bg-gradient-to-b from-[#0a0a1f]/90 via-[#0a0a1f]/80 to-[#0a0a1f]/90"></div>

        <!-- Slide Content -->
        <template v-if="index === 0">
          <!-- First Slide Content -->
          <div class="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
            <h1 class="text-6xl font-bold bg-gradient-to-r from-[#675FF2] to-[#DB3DCF] 
                      text-transparent bg-clip-text animate-gradient mb-4">
              Reelmates
            </h1>
            <p class="text-2xl text-white/90">
              Swipe, discover, and enjoy movies with friends.
            </p>
          </div>
        </template>
        
        <template v-else>
          <!-- Feature Slides -->
          <div class="absolute inset-0 flex flex-col items-center justify-center p-8">
            <!-- Feature Content -->
            <div class="max-w-lg text-center mt-24">
              <component 
                :is="slide.icon" 
                class="w-20 h-20 mb-8 mx-auto text-[#DB3DCF] animate-pulse"
              />
              <h2 class="text-4xl font-bold mb-6 text-white
                        bg-gradient-to-r from-[#675FF2] to-[#DB3DCF] 
                        text-transparent bg-clip-text">
                {{ slide.title }}
              </h2>
              <p class="text-xl text-white/90 leading-relaxed backdrop-blur-sm
                        bg-[#0a0a1f]/30 p-6 rounded-lg">
                {{ slide.description }}
              </p>
            </div>
          </div>
        </template>
      </div>

        <!-- Navigation Dots -->
        <div class="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-30">
          <button 
            v-for="(_, index) in allSlides" 
            :key="index"
            @click="currentSlide = index"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="currentSlide === index ? 
              'bg-[#DB3DCF] w-8' : 
              'bg-white/50 hover:bg-white/70'"
          ></button>
        </div>
      </div>
    </div>

    <!-- Right Side - Register Form with Animated Background -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center px-4 py-8 md:px-6 md:py-12 relative overflow-hidden animated-container">
      <!-- Animated Background Elements -->
      <div class="animated-bg"></div>
      <div class="gradient-blur"></div>
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>
      </div>

      <!-- Logo at Top Right -->
      <div class="absolute top-4 right-4 z-10">
        <img src="@/assets/images/Reelmates_Logo.png" alt="Logo" class="w-16 h-auto" />
      </div>

      <!-- Content with glass effect -->
      <div class="w-full max-w-md relative z-10">
        <h4 class="text-2xl md:text-3xl font-bold text-white mb-4">Create an account</h4>
        <p class="text-[#D0CCE3] mb-6">Already have an account? <router-link to="/login" class="text-[#675FF2] hover:underline">Log in</router-link></p>

        <!-- Error Message Display -->
        <div v-if="errorMessage" class="text-red-500 mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Email/Password Form -->
        <div class="space-y-4">
          <input v-model="email" 
                 type="email" 
                 autocomplete="off"
                 placeholder="Email"
                 class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white 
                        placeholder:text-white/30 focus:outline-none focus:border-[#675FF2] 
                        focus:ring-1 focus:ring-[#675FF2] transition-all duration-300" />

          <input v-model="password" 
                 type="password" 
                 autocomplete="off"
                 placeholder="Enter your password"
                 class="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white 
                        placeholder:text-white/30 focus:outline-none focus:border-[#675FF2] 
                        focus:ring-1 focus:ring-[#675FF2] transition-all duration-300" />

          <button @click="createAccount" 
                  :disabled="isLoading"
                  class="w-full py-3 px-4 rounded-lg bg-[#675FF2] hover:bg-[#675FF2]/80 text-white 
                         font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                         disabled:opacity-50 disabled:cursor-not-allowed">
            {{ isLoading ? 'Creating account...' : 'Create account' }}
          </button>
        </div>

        <div class="relative flex items-center gap-2 my-6">
          <div class="flex-1 border-t border-white/10"></div>
          <span class="text-white/50 text-sm">Or register with</span>
          <div class="flex-1 border-t border-white/10"></div>
        </div>

        <!-- Google Sign In Button -->
        <button @click="signInWithGoogle" 
                :disabled="isLoading"
                class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 
                       text-gray-800 px-4 py-2 rounded-lg transition-all duration-300
                       hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 
                       disabled:cursor-not-allowed">
          <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
          <span>{{ isLoading ? 'Signing in...' : 'Google' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/authService';
import {
  Film,
  Users,
  ThumbsUp
} from 'lucide-vue-next'

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const isLoading = ref(false);
const currentSlide = ref(0);
let carouselInterval;

// Feature data
const features = [
{
    id: 'feature-1',
    title: "Swipe & Match",
    description: "Swipe to like or pass and find movies that match your taste instantly.",
    icon: Film
  },
  {
    id: 'feature-2',
    title: "Watch with Friends",
    description: "Connect and find movies you and your friends will love for the perfect movie night.",
    icon: Users
  },
  {
    id: 'feature-3',
    title: "Smart Recommendations",
    description: "Get personalized movie picks based on your taste. Discover new favorites effortlessly.",
    icon: ThumbsUp
  }
];

// Combine intro slide with features for carousel
const allSlides = computed(() => [
  {
    id: 'intro',
    type: 'intro'
  },
  ...features
]);

// Form validation
const validateForm = () => {
  errorMessage.value = '';
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields';
    return false;
  }
  
  if (!email.value.includes('@')) {
    errorMessage.value = 'Please enter a valid email';
    return false;
  }
  
  if (password.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters';
    return false;
  }
  
  return true;
};

// Auto-advance carousel
const startCarousel = () => {
  carouselInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % allSlides.value.length;
  }, 5000);
};

// Create account with email/password
const createAccount = async () => {
  if (!validateForm()) return;
  
  isLoading.value = true;
  try {
    const result = await authService.registerUser(email.value, password.value);
    
    if (result.success) {
      console.log("Registration successful");
      email.value = "";
      password.value = "";
      router.push('/select-genre');
    } else {
      errorMessage.value = result.error;
    }
  } catch (error) {
    console.error("Registration error:", error);
    errorMessage.value = 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
};

// Google Sign In
const signInWithGoogle = async () => {
  isLoading.value = true;
  try {
    const result = await authService.signInWithGoogle();
    
    if (result.success) {
      console.log("Google sign in successful");
      router.push('/select-genre');
    } else {
      errorMessage.value = result.error;
    }
  } catch (error) {
    console.error("Google sign in error:", error);
    errorMessage.value = 'An unexpected error occurred';
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  startCarousel();
});

onUnmounted(() => {
  if (carouselInterval) {
    clearInterval(carouselInterval);
  }
});
</script>

<style scoped>
/* Core animations */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(30px, 30px) rotate(90deg); }
  50% { transform: translate(0, 60px) rotate(180deg); }
  75% { transform: translate(-30px, 30px) rotate(270deg); }
}

@keyframes pulse {
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.8;
    transform: scale(1.1);
  }
}

/* Feature carousel styles */
.feature-carousel::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(to top, rgba(10, 10, 31, 0.9), transparent);
  pointer-events: none;
  z-index: 25;
}

/* Text animations and effects */
.animate-gradient {
  background-size: 200% auto;
  animation: gradient-shift 4s ease infinite;
}

.animate-pulse {
  filter: drop-shadow(0 0 10px rgba(219, 61, 207, 0.5));
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Form input styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #3C397E inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Animated background */
.animated-container {
  background-color: #000000;
  position: relative;
  isolation: isolate;
}

.animated-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    #000000,
    #3C397E,
    #675FF2,
    #DB3DCF,
    #3C397E,
    #000000
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  opacity: 0.3;
  z-index: 0;
}

.gradient-blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(100px);
  z-index: 1;
}

/* Floating shapes */
.floating-shapes {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 2;
}

.shape {
  position: absolute;
  background: radial-gradient(circle at center, var(--color) 0%, transparent 70%);
  border-radius: 50%;
  animation: float var(--duration) ease-in-out infinite;
  opacity: 0.3;
}

.shape-1 {
  --color: #675FF2;
  --duration: 15s;
  width: 200px;
  height: 200px;
  top: -50px;
  left: -50px;
}

.shape-2 {
  --color: #DB3DCF;
  --duration: 20s;
  width: 150px;
  height: 150px;
  bottom: -30px;
  right: -30px;
  animation-delay: -5s;
}

.shape-3 {
  --color: #3C397E;
  --duration: 18s;
  width: 120px;
  height: 120px;
  bottom: 30%;
  left: 20%;
  animation-delay: -8s;
}

.shape-4 {
  --color: #675FF2;
  --duration: 22s;
  width: 180px;
  height: 180px;
  top: 20%;
  right: 10%;
  animation-delay: -12s;
}

/* Global transitions */
button, a {
  transition: all 0.3s ease;
}

/* Typography */
h2 { letter-spacing: 0.5px; }
p { 
  line-height: 1.8;
  letter-spacing: 0.3px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Transitions */
.transition-opacity {
  transition: opacity 0.5s ease-in-out;
}
</style>