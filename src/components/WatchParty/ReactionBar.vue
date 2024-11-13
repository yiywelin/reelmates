<template>
    <div class="h-16 bg-[#13132b]/90 backdrop-blur-sm border-t border-[#1a1a35] flex items-center justify-center gap-4">
      <button 
        v-for="reaction in reactions" 
        :key="reaction.emoji" 
        @click="$emit('reaction', reaction.emoji)"
        class="group relative px-4 py-2 bg-[#1a1a35] rounded hover:bg-[#675FF2] transition-all hover:scale-110"
      >
        <span class="text-xl">{{ reaction.emoji }}</span>
        <span 
          class="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#13132b] px-2 py-1 rounded text-sm 
          opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
        >
          {{ reaction.label }}
        </span>
      </button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReactionBar',
    data() {
      return {
        reactions: [
          { emoji: '👏', label: 'Clap' },
          { emoji: '❤️', label: 'Love' },
          { emoji: '😮', label: 'Wow' },
          { emoji: '😂', label: 'Laugh' },
          { emoji: '🔥', label: 'Fire' }
        ]
      }
    }
  }
  </script>