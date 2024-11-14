<template>
    <div class="flex flex-wrap justify-center gap-6">
      <div v-for="avatar in processedAvatars" :key="avatar.id" class="group relative">
        <!-- Avatar Container -->
        <div class="relative">
          <!-- Avatar Circle -->
          <div 
            class="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300"
            :class="[
              'bg-[#837AFF] opacity-50', // Brighter base color
              avatar.activeEmojis.length > 0 ? 'opacity-100 bg-[#A299FF] avatar-active' : '' // Even brighter when active
            ]"
          >
            {{ avatar.emoji }}
          </div>
  
          <!-- Online Indicator -->
          <div class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A1F]"></div>
        </div>
        
        <!-- Floating Emojis -->
        <transition-group name="float" tag="div" class="absolute w-full pointer-events-none">
          <span 
            v-for="(emoji, index) in avatar.activeEmojis" 
            :key="`${avatar.id}-${index}`"
            class="floating-emoji absolute bottom-full left-1/2 -translate-x-1/2"
            :style="{ animationDuration: emoji.duration + 'ms' }"
          >
            {{ emoji.icon }}
          </span>
        </transition-group>
        
        <!-- Username Tooltip -->
        <div 
          class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 
          bg-[#13132b] px-2 py-1 rounded text-sm whitespace-nowrap"
        >
          {{ avatar.username }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const EMOJIS = ['😊', '🎉', '✨', '💫', '🌟', '💖', '🎵', '🎬', '🍿', '👀', '💃', '🕺', '🎮', '🎪', '🎨'];
  
  export default {
    name: 'AvatarGroup',
    props: {
      avatars: {
        type: Array,
        required: true
      }
    },
    setup(props) {
      const intervalIds = ref([]);
      const processedAvatars = ref(
        props.avatars.map(avatar => ({
          ...avatar,
          activeEmojis: []
        }))
      );
  
      const getRandomDuration = () => {
        // Random duration between 600ms and 1200ms
        return Math.floor(Math.random() * 600) + 600;
      };
  
      const getRandomDelay = () => {
        // Random delay between 100ms and 2000ms
        return Math.floor(Math.random() * 1900) + 100;
      };
  
      const addEmojiToAvatar = (avatar) => {
        const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const duration = getRandomDuration();
        
        avatar.activeEmojis.push({
          icon: randomEmoji,
          duration: duration
        });
        
        setTimeout(() => {
          avatar.activeEmojis.shift();
        }, duration);
      };
  
      const startRandomEmojis = () => {
        // Delay the start of emoji animations by 6 seconds
        setTimeout(() => {
          // Create multiple intervals with different frequencies
          for (let i = 0; i < 3; i++) {
            const interval = setInterval(() => {
              const randomAvatars = [];
              // Randomly select 1-3 avatars to show emojis
              const numAvatars = Math.floor(Math.random() * 3) + 1;
              
              while (randomAvatars.length < numAvatars) {
                const randomAvatar = processedAvatars.value[
                  Math.floor(Math.random() * processedAvatars.value.length)
                ];
                if (!randomAvatars.includes(randomAvatar)) {
                  randomAvatars.push(randomAvatar);
                }
              }
              
              randomAvatars.forEach(avatar => {
                addEmojiToAvatar(avatar);
              });
            }, 1000 + (i * 500)); // Intervals of 1000ms, 1500ms, and 2000ms
  
            intervalIds.value.push(interval);
          }
  
          // Add some random bursts
          const burstInterval = setInterval(() => {
            if (Math.random() < 0.3) { // 30% chance of burst
              processedAvatars.value.forEach(avatar => {
                if (Math.random() < 0.5) { // 50% chance per avatar
                  setTimeout(() => {
                    addEmojiToAvatar(avatar);
                  }, getRandomDelay());
                }
              });
            }
          }, 3000);
  
          intervalIds.value.push(burstInterval);
        }, 6000); // 6 second initial delay
      };
  
      const stopRandomEmojis = () => {
        intervalIds.value.forEach(id => clearInterval(id));
        intervalIds.value = [];
      };
  
      onMounted(() => {
        startRandomEmojis();
      });
  
      onBeforeUnmount(() => {
        stopRandomEmojis();
      });
  
      return {
        processedAvatars
      };
    }
  }
  </script>
  
  <style scoped>
  .floating-emoji {
    font-size: 24px;
    animation: floatUp 1000ms ease-out forwards;
  }
  
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translate(-50%, 0);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -100px);
    }
  }
  
  .float-enter-active {
    transition: all 0.3s ease;
  }
  
  .float-leave-active {
    transition: all 0.8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  
  .float-enter, .float-leave-to {
    transform: translateY(20px);
    opacity: 0;
  }
  
  /* Fixed avatar animation with proper circular glow */
  .avatar-active {
    animation: bounce 0.5s ease;
    filter: drop-shadow(0 0 10px #A299FF); /* Changed to drop-shadow for circular glow */
    transform-origin: center bottom;
  }
  
  @keyframes bounce {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px) scale(1.05); /* Added slight scale for more bounce effect */
    }
  }
  </style>