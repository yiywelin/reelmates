<template>
  <div class="h-screen bg-[#0A0A1F] text-[#D0CCE3] overflow-hidden relative">
    <div class="h-[0px] flex-shrink-0">  <!-- Added NavBar container with fixed height -->
      <NavBar />
    </div>
    <div class="absolute inset-0 pt-[70px] bg-gradient-to-b from-[#0A0A1F] via-[#13132b] to-[#0A0A1F] animate-gradient"></div>

    <div class="fixed top-4 right-4 z-50 space-y-2" ref="notifications"></div>

    <div class="relative z-10 flex flex-col h-[calc(100vh-70px)] pt-[70px]"> <!-- Adjusted height and added padding top -->
      <!-- Header with Movie Info and Progress Bar -->
      <div class="absolute top-[70px] left-0 right-0 h-20 bg-[#13132b]/90 backdrop-blur-sm border-b border-[#DB3DCF] 
        flex items-center justify-between px-6">
         <div class="flex items-center gap-4">
          <span class="text-[#DB3DCF] text-2xl">🎥</span>
          <div>
            <div class="text-lg font-bold mb-1">Now Playing: The Matrix</div>
            <div class="flex items-center gap-3">
              <span class="text-sm">{{ currentTime }}</span>
              <div class="relative w-48 h-1 bg-[#1a1a35] rounded overflow-hidden">
                <!-- Movie Progress Bar -->
                <div class="absolute top-0 left-0 h-full bg-[#675FF2] rounded animate-pulse" 
                  :style="{ width: progressBarWidth + '%' }"></div>
              </div>
              <span class="text-sm">{{ movieDuration }}</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[#D0CCE3] cursor-pointer">🔊</span>
          <button @click="toggleUserList" 
            class="flex items-center gap-2 px-3 py-1 rounded bg-[#1a1a35] hover:bg-[#675FF2] transition-colors">
            <span>👥</span>
            <span>{{ userCount }} watching</span>
          </button>
        </div>
      </div>

      <!-- Main Central Area -->
      <div class="flex flex-1 mt-20">
        <!-- Center Area -->
        <div class="flex-1 relative">
          <div class="absolute bottom-24 w-full flex justify-center" ref="avatars">
            <div class="flex flex-wrap justify-center gap-6">
              <div v-for="avatar in avatars" :key="avatar.id" class="group relative">
                <div class="w-12 h-12 bg-[#675FF2] rounded-full flex items-center justify-center text-2xl" 
                  :class="{ 'opacity-60': avatar.status === 'idle' }">
                  {{ avatar.emoji }}
                </div>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 
                  bg-[#13132b] px-2 py-1 rounded text-sm whitespace-nowrap">
                  {{ avatar.username }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User List -->
        <div v-if="showUserList" class="w-64 bg-[#13132b]/90 backdrop-blur-sm border-l border-[#1a1a35]">
          <div class="p-4 border-b border-[#1a1a35]">
            <h3 class="font-bold">Viewers</h3>
          </div>
          <div class="overflow-y-auto h-full" ref="userListContainer"></div>
        </div>

        <!-- Chat Area -->
        <div class="w-80 bg-[#13132b]/90 backdrop-blur-sm border-l border-[#1a1a35] flex flex-col">
          <div class="p-4 border-b border-[#1a1a35] flex items-center gap-2">
            <span class="text-2xl">💬</span>
            <span class="font-bold">Chat</span>
          </div>
          <div class="flex-1 overflow-y-auto p-4 space-y-2" ref="messageContainer">
            <div v-for="msg in messages" :key="msg.timestamp" 
              class="group relative text-sm hover:bg-[#1a1a35] p-2 rounded transition-colors">
              <span class="font-bold text-[#DB3DCF]">{{ msg.user }}: </span>
              <span>{{ msg.text }}</span>
              <span class="text-xs text-gray-500 absolute right-2 top-2">{{ msg.timestamp.toLocaleTimeString() }}</span>
            </div>
          </div>
          <div class="p-4 border-t border-[#1a1a35]">
            <div class="flex gap-2">
              <textarea v-model="messageInput" @keydown.enter="sendMessage" 
                placeholder="Type a message..." 
                class="flex-1 px-3 py-2 bg-[#1a1a35] rounded border-none text-[#D0CCE3] 
                placeholder-gray-400 resize-none h-10 min-h-[40px] max-h-32"></textarea>
              <button @click="sendMessage" 
                class="px-4 py-2 bg-[#675FF2] rounded hover:bg-[#DB3DCF] transition-colors 
                flex items-center justify-center">
                <span>➡️</span>
              </button>
            </div>
            <div class="text-xs text-gray-400 mt-2">Press Enter to send, Shift + Enter for new line</div>
          </div>
        </div>
      </div>

      <!-- Emoji Reaction Buttons -->
      <div class="h-16 bg-[#13132b]/90 backdrop-blur-sm border-t border-[#1a1a35] flex items-center justify-center gap-4">
        <button v-for="reaction in reactions" :key="reaction.emoji" 
          @click="handleReaction(reaction.emoji)" 
          class="group relative px-4 py-2 bg-[#1a1a35] rounded hover:bg-[#675FF2] transition-all hover:scale-110">
          <span class="text-xl">{{ reaction.emoji }}</span>
          <span class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#13132b] px-2 py-1 rounded text-sm 
            opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{{ reaction.label }}</span>
        </button>
      </div>

      <!-- Floating Emojis Overlay -->
      <div class="fixed inset-0 pointer-events-none">
        <transition-group name="float" tag="div">
          <span v-for="(reaction, index) in activeReactions" :key="index" class="floating-emoji">
            {{ reaction }}
          </span>
        </transition-group>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import NavBar from '@/components/ui/NavBar.vue'
  export default {
    components: {
    NavBar
    },
    data() {
      return {
        notifications: [],
        messages: [
          { user: 'MovieBuff', text: 'This scene is incredible!', timestamp: new Date() },
          { user: 'CinemaFan', text: 'Wait for what comes next!', timestamp: new Date() },
          { user: 'FilmGeek', text: 'The cinematography here is amazing', timestamp: new Date() }
        ],
        avatars: Array.from({ length: 15 }, (_, i) => ({
          id: i,
          emoji: '👤',
          username: `User${i + 1}`,
          status: Math.random() > 0.3 ? 'active' : 'idle'
        })),
        messageInput: '',
        showUserList: false,
        reactions: [
          { emoji: '👏', label: 'Clap' },
          { emoji: '❤️', label: 'Love' },
          { emoji: '😮', label: 'Wow' },
          { emoji: '😂', label: 'Laugh' },
          { emoji: '🔥', label: 'Fire' }
        ],
        activeReactions: [], // For temporarily displaying floating emojis
        currentTime: "1:05:30",
        movieDuration: "2:16:00",
        progressBarWidth: 50
      };
    },
    computed: {
      userCount() {
        return this.avatars.length;
      }
    },
    methods: {
      toggleUserList() {
        this.showUserList = !this.showUserList;
      },
      sendMessage() {
        if (this.messageInput.trim()) {
          this.messages.push({ user: 'You', text: this.messageInput, timestamp: new Date() });
          this.messageInput = '';
        }
      },
      handleReaction(emoji) {
        // Add the emoji to activeReactions for floating effect
        this.activeReactions.push(emoji);
        setTimeout(() => {
          this.activeReactions.shift(); // Remove emoji after 1 second
        }, 1000);
      }
    }
  };
  </script>
  
  <style scoped>
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .animate-slideIn {
    animation: slideIn 0.3s forwards;
  }
  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }
  .animate-gradient {
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }
  
  /* Floating animation for emojis */
  @keyframes floatUp {
    0% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-200px);
    }
  }
  
  /* Style for floating emojis */
  .floating-emoji {
    position: absolute;
    bottom: 80px; /* Position above the emoji bar */
    left: 50%;
    transform: translateX(-50%);
    font-size: 24px;
    animation: floatUp 1s ease-out forwards;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
    opacity: 0;
  }
  </style>
  