<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-white">Plan Movie Night</h2>
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-white">Selected {{ selectedItems.length > 1 ? 'Friends' : 'Friend' }}:</h3>
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
          <label for="time" class="block text-sm font-medium text-gray-300 mb-1">Time:</label>
          <input
            id="time"
            v-model="time"
            type="time"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
  import { ref } from 'vue';
  
  const props = defineProps({
    selectedItems: {
      type: Array,
      required: true
    }
  });
  
  const emit = defineEmits(['close']);
  
  const movie = ref('');
  const date = ref('');
  const time = ref('');
  
  const planMovieNight = () => {
    // Here you would typically send this data to your backend or state management system
    console.log('Planning movie night:', {
      movie: movie.value,
      date: date.value,
      time: time.value,
      friends: props.selectedItems.map(item => item.name)
    });
    
    // Close the modal
    emit('close');
  };
  </script>