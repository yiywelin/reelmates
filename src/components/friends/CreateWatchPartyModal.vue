<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <!-- Modal container -->
      <div class="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-white">Plan Movie Night</h2>
        
        <!-- Display selected friends -->
        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-2 text-white">
            Selected {{ selectedItems.length > 1 ? 'Friends' : 'Friend' }}:
          </h3>
          <ul class="list-disc list-inside text-gray-300">
            <li v-for="item in selectedItems" :key="item.id">{{ item.name }}</li>
          </ul>
        </div>
        
        <!-- Movie title input -->
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
        
        <!-- Date input -->
        <div class="mb-4">
          <label for="date" class="block text-sm font-medium text-gray-300 mb-1">Date:</label>
          <input
            id="date"
            v-model="date"
            type="date"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- Time input -->
        <div class="mb-4">
          <label for="time" class="block text-sm font-medium text-gray-300 mb-1">Time:</label>
          <input
            id="time"
            v-model="time"
            type="time"
            class="w-full px-3 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <!-- Action buttons -->
        <div class="flex justify-end space-x-2">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="handlePlanMovieNight"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Plan Movie Night
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineProps, defineEmits } from 'vue';
  import { collection, doc, updateDoc } from 'firebase/firestore';
  import { db } from '@/firebaseConfig';
  
  // Define props for receiving selected friends from the parent component
  const props = defineProps({
    selectedItems: {
      type: Array,
      required: true
    }
  });
  
  // Define emits to notify the parent when the modal should close
  const emit = defineEmits(['close']);
  
  // Reactive variables for storing movie night details
  const movie = ref('');
  const date = ref('');
  const time = ref('');
  
  // Function to handle the creation of a movie night and update friends' "watchparty" fields
  const handlePlanMovieNight = async () => {
    try {
      // Generate a unique chatId for the watch party
      const chatId = doc(collection(db, 'chats')).id;
      console.log('Generated chatId:', chatId);
  
      // Prepare an array of update promises for each friend
      const updatePromises = props.selectedItems.map(async (friend) => {
        const friendDocRef = doc(db, 'users', friend.id); // Get reference to each friend's document
        ////////////////////////////////////////////////////check this^

        await updateDoc(friendDocRef, {
          watchparty: chatId // Set the "watchparty" field to the new chatId
        });
      });
  
      // Wait for all friend documents to be updated
      await Promise.all(updatePromises);
  
      // Log success message
      console.log('Watchparty field updated successfully for all selected friends.');
  
      // Optionally, log or send this information somewhere
      console.log('Planned movie night:', {
        movie: movie.value,
        date: date.value,
        time: time.value,
        chatId: chatId,
        friends: props.selectedItems.map(item => item.name) // Friend names for reference
      });
  
      // Emit the 'close' event to close the modal
      emit('close');
  
    } catch (error) {
      console.error('Error updating watchparty field for selected friends:', error);
      alert('Failed to plan movie night. Please try again.');
    }
  };
  </script>
  
