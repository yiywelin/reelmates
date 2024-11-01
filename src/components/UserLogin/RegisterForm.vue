<template>
  <div class="min-h-screen w-full flex">
    <!-- Left Side - Wallpaper (unchanged) -->
    <div class="hidden lg:flex lg:w-1/2 relative bg-[#D0CCE3]">
      <img src="@/assets/images/moviePoster2.jpg" alt="Background Image" class="w-full h-full object-cover" />
    </div>

    <!-- Right Side - Login Form with Animated Background -->
    <div class="w-full lg:w-1/2 flex flex-col justify-center items-center p-10 md:p-16 relative overflow-hidden animated-container">
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
        <img src="@/assets/images/Reelmates_Logo.png" alt="Logo" class="w-20 h-auto" />
      </div>

      <!-- Content with glass effect -->
      <div class="w-full max-w-md relative z-10">
        <h4 class="text-4xl md:text-5xl font-bold text-white mb-6">Create an account</h4>
        <p class="text-[#D0CCE3] mb-10">Already have an account? <router-link to="/login" class="text-[#675FF2] hover:underline">Log in</router-link></p>

        <!-- Error Message Display (New) -->
        <div v-if="errorMessage" 
             class="text-red-500 bg-red-100/10 p-3 rounded-lg mb-4 text-sm">
          {{ errorMessage }}
        </div>

        <!-- Email/Password Form -->
        <div class="space-y-6">
          <div class="relative">
            <input v-model="email" 
                   type="email" 
                   autocomplete="off"
                   placeholder="Email"
                   class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                          placeholder:text-white/30 focus:outline-none focus:border-[#675FF2] 
                          focus:ring-1 focus:ring-[#675FF2] transition-all duration-300" />
          </div>

          <div class="relative">
            <input v-model="password" 
                   type="password" 
                   autocomplete="off"
                   placeholder="Enter your password"
                   class="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white 
                          placeholder:text-white/30 focus:outline-none focus:border-[#675FF2] 
                          focus:ring-1 focus:ring-[#675FF2] transition-all duration-300" />
          </div>

          <div class="flex gap-4 mt-6">
            <button @click="createAccount" 
                    :disabled="isLoading"
                    class="w-full py-3 px-4 rounded-lg bg-[#675FF2] hover:bg-[#675FF2]/80 text-white 
                           font-medium transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
                           hover:animate-pulse disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isLoading ? 'Creating account...' : 'Create account' }}
            </button>
          </div>
        </div>

        <div class="relative flex items-center gap-3 my-8">
          <div class="flex-1 border-t border-white/10"></div>
          <span class="text-white/50 text-sm">Or register with</span>
          <div class="flex-1 border-t border-white/10"></div>
        </div>

        <!-- Google/Apple Sign In Buttons -->
        <div class="flex gap-4">
          <button @click="signInWithGoogle" 
                  :disabled="isLoading"
                  class="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 
                         text-gray-800 px-6 py-3 rounded-lg transition-all duration-300
                         hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 
                         disabled:cursor-not-allowed">
            <img src="https://www.google.com/favicon.ico" alt="Google" class="w-5 h-5" />
            <span>{{ isLoading ? 'Signing in...' : 'Google' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../../services/authService';

export default {
  name: "RegisterForm",
  setup() {
    const router = useRouter();
    const email = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const isLoading = ref(false);

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
          router.push('/home');
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
          router.push('/home');
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

    return {
      email,
      password,
      errorMessage,
      isLoading,
      signInWithGoogle,
      createAccount,
    };
  }
};
</script>

<style scoped>
.carousel-container {
  transition: transform 0.5s ease-in-out;
}

/* Ensure smooth transitions for carousel slides */
.carousel-container > div {
  transition: transform 0.5s ease-in-out;
}

/* Input autofill styling */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #3C397E inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* ADDED: Animated background styles */
/* Container for the animated background */
.animated-container {
  background-color: #000000;
  position: relative;
  isolation: isolate;
}

/* Animated background styles */
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
  animation: gradient 15s ease infinite;
  opacity: 0.3;
  z-index: 0;
}

.gradient-blur {
  position: absolute;
  inset: 0;
  backdrop-filter: blur(100px);
  z-index: 1;
}

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
  --duration: 20s;
  width: 400px;
  height: 400px;
  top: -100px;
  left: -100px;
}

.shape-2 {
  --color: #DB3DCF;
  --duration: 25s;
  width: 300px;
  height: 300px;
  bottom: -50px;
  right: -50px;
  animation-delay: -5s;
}

.shape-3 {
  --color: #3C397E;
  --duration: 22s;
  width: 250px;
  height: 250px;
  bottom: 30%;
  left: 20%;
  animation-delay: -8s;
}

.shape-4 {
  --color: #675FF2;
  --duration: 28s;
  width: 350px;
  height: 350px;
  top: 20%;
  right: 10%;
  animation-delay: -12s;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  25% {
    transform: translate(50px, 50px) rotate(90deg);
  }
  50% {
    transform: translate(0, 100px) rotate(180deg);
  }
  75% {
    transform: translate(-50px, 50px) rotate(270deg);
  }
}

/* Enhanced button animations */
button, a {
  transition: all 0.3s ease;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>