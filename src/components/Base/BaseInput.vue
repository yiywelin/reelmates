<template>
  <div class="relative group" :style="{ '--input-color': randomColor }">
    <label 
      :for="id" 
      class="absolute left-3 transition-all duration-300 pointer-events-none text-gray-400"
      :class="[
        modelValue ? '-top-6 text-sm' : 'top-2',
        focused ? 'text-[var(--input-color)]' : ''
      ]"
    >
      {{ label }}
    </label>

    <input
      :id="id"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="focused = true"
      @blur="focused = false"
      class="w-full px-3 py-2 bg-gray-800/50 rounded-lg border-2 transition-all duration-300 outline-none text-white"
      :class="[
        focused ? 'border-[var(--input-color)] shadow-glow' : 'border-gray-600',
        'placeholder-gray-500'
      ]"
      v-bind="$attrs"
    />

    <div 
      class="absolute bottom-0 left-0 h-0.5 bg-[var(--input-color)] transition-all duration-300"
      :class="focused ? 'w-full' : 'w-0'"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])

const focused = ref(false)
const randomColor = ref('')

onMounted(() => {
  const hue = Math.floor(Math.random() * 360)
  randomColor.value = `hsl(${hue}, 70%, 60%)`
})
</script>

<style scoped>
.shadow-glow {
  box-shadow: 0 0 15px var(--input-color);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: white;
  -webkit-box-shadow: 0 0 0px 1000px #1f2937 inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style> 