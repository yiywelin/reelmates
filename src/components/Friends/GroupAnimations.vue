<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="group-animation">
    <defs>
      <linearGradient id="twistGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6a1b9a" />
        <stop offset="100%" style="stop-color:#9c27b0" />
      </linearGradient>
      <linearGradient id="timeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1a237e" />
        <stop offset="100%" style="stop-color:#3f51b5" />
      </linearGradient>
      <linearGradient id="dreamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#311b92" />
        <stop offset="100%" style="stop-color:#7c4dff" />
      </linearGradient>
      <linearGradient id="parallelGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#004d40" />
        <stop offset="100%" style="stop-color:#009688" />
      </linearGradient>
      <linearGradient id="symphonyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#bf360c" />
        <stop offset="100%" style="stop-color:#ff5722" />
      </linearGradient>
      <linearGradient id="bearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#795548" />
        <stop offset="100%" style="stop-color:#8d6e63" />
      </linearGradient>
      <linearGradient id="deerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#a1887f" />
        <stop offset="100%" style="stop-color:#bcaaa4" />
      </linearGradient>
      <linearGradient id="owlGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#5d4037" />
        <stop offset="100%" style="stop-color:#795548" />
      </linearGradient>
      <linearGradient id="alienGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#00bfa5" />
        <stop offset="100%" style="stop-color:#1de9b6" />
      </linearGradient>
      <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#616161" />
        <stop offset="100%" style="stop-color:#9e9e9e" />
      </linearGradient>
    </defs>
    <g v-html="selectedAnimation.template"></g>
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  seed: {
    type: Number,
    default: () => Math.random()
  },
  forcedAnimation: {
    type: String,
    default: null
  }
})

const usedAnimations = new Set()

const animations = {
  PlotTwist: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#twistGradient)" />
        <path d="M25 25 Q50 75 75 25" stroke="#fff" fill="none" stroke-width="2">
          <animate attributeName="d" values="M25 25 Q50 75 75 25;M25 75 Q50 25 75 75;M25 25 Q50 75 75 25" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="25" cy="25" r="4" fill="#fff">
          <animate attributeName="cy" values="25;75;25" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="25" r="4" fill="#fff">
          <animate attributeName="cy" values="25;75;25" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
    `
  },
  TimeTravel: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#timeGradient)" />
        <path d="M30 50 C30 30 70 70 70 50 C70 30 30 70 30 50" stroke="#fff" fill="none" stroke-width="2">
          <animate attributeName="stroke-dasharray" values="0,200;200,200" dur="3s" repeatCount="indefinite" />
        </path>
        <circle cx="50" cy="50" r="3" fill="#fff" />
        <line x1="50" y1="50" x2="65" y2="35" stroke="#fff" stroke-width="2">
          <animate attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="-360 50 50" dur="10s" repeatCount="indefinite" />
        </line>
      </g>
    `
  },
  DreamSequence: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#dreamGradient)" />
        <path d="M25 50 Q40 25 50 50 Q60 75 75 50" fill="none" stroke="#fff" stroke-width="2" opacity="0.6">
          <animate attributeName="d" values="M25 50 Q40 25 50 50 Q60 75 75 50;M25 45 Q40 70 50 45 Q60 20 75 45;M25 50 Q40 25 50 50 Q60 75 75 50" dur="5s" repeatCount="indefinite" />
        </path>
        <circle cx="40" cy="40" r="2" fill="#fff">
          <animate attributeName="cy" values="40;35;40" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="60" r="2" fill="#fff">
          <animate attributeName="cy" values="60;55;60" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
    `
  },
  ParallelUniverse: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#parallelGradient)" />
        <path d="M15 15 L85 85" stroke="#fff" stroke-width="2">
          <animate attributeName="stroke-dasharray" values="0,200;200,200" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="30" cy="30" r="12" fill="none" stroke="#fff" stroke-width="2">
          <animate attributeName="r" values="12;18;12" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="70" cy="70" r="12" fill="none" stroke="#fff" stroke-width="2">
          <animate attributeName="r" values="18;12;18" dur="3s" repeatCount="indefinite" />
        </circle>
      </g>
    `
  },
  VisualSymphony: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#symphonyGradient)" />
        <path d="M15 50 Q35 25 50 50 Q65 75 85 50" fill="none" stroke="#fff" stroke-width="2">
          <animate attributeName="d" values="M15 50 Q35 25 50 50 Q65 75 85 50;M15 50 Q35 75 50 50 Q65 25 85 50;M15 50 Q35 25 50 50 Q65 75 85 50" dur="2s" repeatCount="indefinite" />
        </path>
        <circle cx="50" cy="50" r="10" fill="none" stroke="#fff" stroke-width="2">
          <animate attributeName="r" values="10;15;10" dur="1s" repeatCount="indefinite" />
        </circle>
      </g>
    `
  },
  CuddlyBear: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#bearGradient)" />
        <!-- Ears -->
        <circle cx="30" cy="30" r="10" fill="#fff">
          <animate attributeName="transform" attributeType="XML" type="rotate"
            values="-5 30 30;5 30 30;-5 30 30"
            dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="70" cy="30" r="10" fill="#fff">
          <animate attributeName="transform" attributeType="XML" type="rotate"
            values="5 70 30;-5 70 30;5 70 30"
            dur="3s" repeatCount="indefinite"/>
        </circle>
        <!-- Eyes -->
        <circle cx="40" cy="45" r="5" fill="#fff"/>
        <circle cx="60" cy="45" r="5" fill="#fff"/>
        <circle cx="40" cy="45" r="2" fill="#000">
          <animate attributeName="cy"
            values="45;44;45"
            dur="2s" repeatCount="indefinite"/>
        </circle>
        <circle cx="60" cy="45" r="2" fill="#000">
          <animate attributeName="cy"
            values="45;44;45"
            dur="2s" repeatCount="indefinite"/>
        </circle>
        <!-- Nose -->
        <circle cx="50" cy="55" r="4" fill="#000">
          <animate attributeName="r"
            values="4;4.5;4"
            dur="2s" repeatCount="indefinite"/>
        </circle>
        <!-- Mouth -->
        <path d="M45 60 Q50 65 55 60" stroke="#fff" stroke-width="2" fill="none">
          <animate attributeName="d"
            values="M45 60 Q50 65 55 60;M45 62 Q50 67 55 62;M45 60 Q50 65 55 60"
            dur="3s" repeatCount="indefinite"/>
        </path>
      </g>
    `
  },
  FriendlyAlien: {
    template: `
      <g transform="translate(0, 0)">
        <circle cx="50" cy="50" r="50" fill="url(#alienGradient)" />
        <!-- Antenna -->
        <path d="M50 20 L50 35" stroke="#fff" stroke-width="2">
          <animate attributeName="d"
            values="M50 20 L50 35;M48 20 L50 35;M52 20 L50 35;M50 20 L50 35"
            dur="2s" repeatCount="indefinite"/>
        </path>
        <circle cx="50" cy="20" r="3" fill="#fff">
          <animate attributeName="r"
            values="3;4;3"
            dur="1s" repeatCount="indefinite"/>
        </circle>
        <!-- Large Eyes -->
        <ellipse cx="35" cy="45" rx="10" ry="15" fill="#fff"/>
        <ellipse cx="65" cy="45" rx="10" ry="15" fill="#fff"/>
        <circle cx="35" cy="45" r="5" fill="#000">
          <animate attributeName="cy"
            values="45;43;45"
            dur="3s" repeatCount="indefinite"/>
        </circle>
        <circle cx="65" cy="45" r="5" fill="#000">
          <animate attributeName="cy"
            values="45;43;45"
            dur="3s" repeatCount="indefinite"/>
        </circle>
        <!-- Smile -->
        <path d="M40 65 Q50 75 60 65" stroke="#fff" stroke-width="3" fill="none">
          <animate attributeName="d"
            values="M40 65 Q50 75 60 65;M40 67 Q50 77 60 67;M40 65 Q50 75 60 65"
            dur="4s" repeatCount="indefinite"/>
        </path>
      </g>
    `
  }
}

const selectedAnimation = computed(() => {
  if (props.forcedAnimation && animations[props.forcedAnimation]) {
    return animations[props.forcedAnimation]
  }
  
  const keys = Object.keys(animations)
  if (usedAnimations.size === keys.length) {
    usedAnimations.clear()
  }
  
  const availableKeys = keys.filter(key => !usedAnimations.has(key))
  const randomIndex = Math.floor((props.seed * 1000) % availableKeys.length)
  const selectedKey = availableKeys[randomIndex]
  usedAnimations.add(selectedKey)
  
  return animations[selectedKey]
})
</script>

<style scoped>
.group-animation {
  width: 100%;
  height: 100%;
}
</style> 