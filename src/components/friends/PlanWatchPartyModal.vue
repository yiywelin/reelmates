<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-white">Plan Movie Night</h2>
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-white">Selected {{ isGroup ? (selectedItems.length > 1 ? 'Groups' : 'Group') : (selectedItems.length > 1 ? 'Friends' : 'Friend') }}:</h3>
          <ul class="list-disc list-inside text-gray-300">
            <li v-for="item in selectedItems" :key="item.id">{{ item.name }}</li>
          </ul>
        </div>
        <div class="mb-4">
          <label for="movie" class="block text-sm font-medium text-gray-300 mb-1">Movie:</label>
          <input
            id="movie"
            v-model="movie"
            type="text"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter movie title"
          />
        </div>
        <div class="mb-4">
          <label for="date" class="block text-sm font-medium text-gray-300 mb-1">Date:</label>
          <input
            id="date"
            v-model="date"
            type="date"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div class="mb-4">
          <label for="hour" class="block text-sm font-medium text-gray-300 mb-1">Time:</label>
          <div class="flex space-x-2">
            <select
              v-model="hour"
              class="w-1/2 px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="h in 24" :key="h-1" :value="(h-1).toString().padStart(2, '0')">
                {{ (h-1).toString().padStart(2, '0') }}
              </option>
            </select>
            <select
              v-model="minute"
              class="w-1/2 px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="00">00</option>
              <option value="15">15</option>
              <option value="30">30</option>
              <option value="45">45</option>
            </select>
          </div>
        </div>
        <div class="flex justify-end space-x-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="planMovieNight"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Plan Movie Night
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps({
    selectedItems: {
      type: Array,
      required: true
    },
    isGroup: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['close']);
  
  const movie = ref('');
  const date = ref('');
  const hour = ref('19'); // Default to 7 PM
  const minute = ref('00');
  
  const time = computed(() => `${hour.value}:${minute.value}`);
  
  const planMovieNight = () => {
    console.log('Planning movie night:', {
      movie: movie.value,
      date: date.value,
      time: time.value,
      participants: props.selectedItems.map(item => item.name)
    });
    
    emit('close');
  };
  </script>
