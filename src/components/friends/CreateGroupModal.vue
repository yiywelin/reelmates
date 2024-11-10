<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" @click="closeModal"></div>
  
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
        <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 bg-gray-900 sm:p-6 sm:pb-4">
            <h3 class="text-xl font-semibold leading-6 text-white" id="modal-title">
              Create a Group
            </h3>
            <div class="mt-4">
              <input
                v-model="groupName"
                type="text"
                placeholder="Enter group name"
                class="w-full px-4 py-2 text-sm text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              />
            </div>
            <div class="mt-4">
              <h4 class="text-lg font-medium text-white mb-2">Select Friends</h4>
              <div class="mb-2">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search friends"
                  class="w-full px-4 py-2 text-sm text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div v-if="isFetchingFriends" class="text-center py-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
              <div v-else-if="friendsError" class="text-red-500 text-center py-4">
                {{ friendsError }}
              </div>
              <div v-else-if="filteredFriends.length === 0" class="text-center py-4 text-gray-400">
                No friends found
              </div>
              <div v-else class="max-h-48 overflow-y-auto">
                <div v-for="friend in filteredFriends" :key="friend.id" class="flex items-center justify-between mb-2 p-2 rounded hover:bg-gray-800">
                  <div class="flex items-center">
                    <img :src="friend.avatar || '/img/default-avatar.png'" alt="Avatar" class="w-8 h-8 rounded-full mr-2" />
                    <span class="text-white">{{ friend.name }}</span>
                  </div>
                  <button
                    @click="toggleFriend(friend)"
                    :class="['px-2 py-1 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors', 
                      selectedFriends.includes(friend.id) ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-600 text-white hover:bg-gray-700']"
                  >
                    {{ selectedFriends.includes(friend.id) ? 'Added' : 'Add' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-800 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              @click="createGroup"
              :disabled="isLoading || !groupName || selectedFriends.length === 0"
            >
              {{ isLoading ? 'Creating...' : 'Create Group' }}
            </button>
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-700 text-base font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              @click="closeModal"
              :disabled="isLoading"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, computed, onMounted } from 'vue';
  import { getAuth } from 'firebase/auth';
  import { collection, addDoc, updateDoc, arrayUnion, doc } from 'firebase/firestore';
  import { db } from '@/firebaseConfig';
  import { useFriends } from '@/composables/useFriends';
  import { celebrate } from '@/utils/celebration'
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['close', 'groupCreated']);
  
  const { friends, isFetchingFriends, friendsError, fetchFriends } = useFriends();
  
  const auth = getAuth();
  
  const groupName = ref('');
  const selectedFriends = ref([]);
  const searchQuery = ref('');
  const isLoading = ref(false);
  
  const filteredFriends = computed(() => {
    if (!friends.value) return [];
    
    const lowercaseQuery = searchQuery.value.toLowerCase();
    return friends.value.filter(friend => 
      friend.name.toLowerCase().includes(lowercaseQuery)
    );
  });
  
  watch(() => props.isOpen, (newValue) => {
    if (newValue) {
      console.log('Modal opened, fetching friends...');
      fetchFriends();
    }
  });
  
  onMounted(() => {
    if (props.isOpen) {
      console.log('Component mounted, fetching friends...');
      fetchFriends();
    }
  });
  
  const toggleFriend = (friend) => {
    const index = selectedFriends.value.indexOf(friend.id);
    if (index === -1) {
      selectedFriends.value.push(friend.id);
    } else {
      selectedFriends.value.splice(index, 1);
    }
  };
  
  const createGroup = async () => {
    if (groupName.value.trim() === '' || selectedFriends.value.length === 0) {
      alert('Please enter a group name and select at least one friend.');
      return;
    }
  
    isLoading.value = true;
  
    try {
      const groupRef = await addDoc(collection(db, 'groups'), {
        name: groupName.value.trim(),
        createdBy: auth.currentUser?.uid,
        members: [auth.currentUser?.uid, ...selectedFriends.value],
        createdAt: new Date(),
      });
  
      const userRef = collection(db, 'users');
      const updatePromises = [auth.currentUser?.uid, ...selectedFriends.value].map(userId =>
        updateDoc(doc(userRef, userId), {
          groups: arrayUnion(groupRef.id)
        })
      );
  
      await Promise.all(updatePromises);
  
      celebrate('group');
  
      console.log('Group created successfully:', groupName.value);
      emit('groupCreated');
      closeModal();
    } catch (err) {
      console.error('Error creating group:', err);
      alert('Failed to create group. Please try again.');
    } finally {
      isLoading.value = false;
    }
  };
  
  const closeModal = () => {
    groupName.value = '';
    selectedFriends.value = [];
    searchQuery.value = '';
    emit('close');
  };
  </script>