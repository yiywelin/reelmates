<template>
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true" @click="closeModal"></div>
  
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
  
        <div class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-gray-900 rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="px-4 pt-5 pb-4 bg-gray-900 sm:p-6 sm:pb-4">
            <h3 class="text-xl font-semibold leading-6 text-white" id="modal-title">
              Add a Friend
            </h3>
            <div class="mt-4">
              <input
                v-model="friendIdentifier"
                type="text"
                placeholder="Enter friend's email or username"
                class="w-full px-4 py-2 text-sm text-white bg-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                :disabled="isLoading"
              />
              <p v-if="error" class="mt-2 text-sm text-red-400">{{ error }}</p>
            </div>
            <div v-if="showInviteLink" class="mt-4 p-4 bg-gray-800 rounded-md">
                <div class="flex items-center space-x-4">
                    <div class="flex flex-col space-y-2">
                    <span class="text-xl text-[#e8f0fb]">Looks like they're not here yet!</span>
                    <span class="text-md text-[#64a5ff]">Invite them to join using the link below.</span>
                    </div>
                        <img 
                            src="@/assets/images/friends/cat_cry.gif" 
                            alt="Crying cat emoji" 
                            class="inline-block w-25 h-16" 
                            aria-hidden="true" 
                        />

    </div>
              <div class="flex items-center mt-4">
                <input
                  ref="inviteLinkInput"
                  :value="inviteLink"
                  readonly
                  class="flex-grow px-3 py-2 text-sm text-white bg-gray-700 rounded-l-md focus:outline-none"
                />
                <button
                  @click="copyInviteLink"
                  class="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors group relative flex items-center justify-center"
                >
                  <LinkIcon class="w-5 h-5" />
                  <span class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Copy invite link
                  </span>
                </button>
              </div>
              <!-- <p class="text-xs text-gray-400 mt-2">Share this link with your friend to invite them to ReelMates.</p> -->
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-800 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors"
              @click="addFriend"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Adding...' : 'Add Friend' }}
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
  import { ref, toRefs } from 'vue';
  import { getAuth } from 'firebase/auth';
  import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
  import { db } from '@/firebaseConfig';
  import { LinkIcon } from 'lucide-vue-next';
//   import { UserPlus } from 'lucide-vue-next';
  import { celebrate } from '@/utils/celebration'
  
  const props = defineProps({
    isOpen: {
      type: Boolean,
      default: false
    }
  });
  
  const { isOpen } = toRefs(props);
  
  const emit = defineEmits(['close', 'friendAdded']);
  
  const auth = getAuth();
  
  const friendIdentifier = ref('');
  const error = ref('');
  const isLoading = ref(false);
  const showInviteLink = ref(false);
  const inviteLink = ref('');
  const inviteLinkInput = ref(null);
  
  const closeModal = () => {
    emit('close');
    friendIdentifier.value = '';
    error.value = '';
    showInviteLink.value = false;
  };
  
  const addFriend = async () => {
    if (!friendIdentifier.value) {
      error.value = 'Please enter a valid email or username.';
      return;
    }
  
    isLoading.value = true;
    error.value = '';
    showInviteLink.value = false;
  
    try {
      const usersRef = collection(db, 'users');
      let friendQuery;
  
      if (friendIdentifier.value.includes('@')) {
        friendQuery = query(usersRef, where('email', '==', friendIdentifier.value));
      } else {
        friendQuery = query(usersRef, where('username', '==', friendIdentifier.value));
      }
  
      const querySnapshot = await getDocs(friendQuery);
  
      if (querySnapshot.empty) {
        showInviteLink.value = true;
        inviteLink.value = `${window.location.origin}/register?invitedBy=${auth.currentUser.uid}&email=${encodeURIComponent(friendIdentifier.value)}`;
        error.value = ''; // Remove the error message as we're now displaying it differently
        isLoading.value = false;
        return;
      }
  
      const friendDoc = querySnapshot.docs[0];
      const friendId = friendDoc.id;
  
      if (friendId === auth.currentUser.uid) {
        error.value = 'You cannot add yourself as a friend.';
        isLoading.value = false;
        return;
      }
  
      const currentUserRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(currentUserRef, {
        friends: arrayUnion(friendId)
      });
  
      const friendRef = doc(db, 'users', friendId);
      await updateDoc(friendRef, {
        friends: arrayUnion(auth.currentUser.uid)
      });
  
      // Add celebration
      celebrate('friend')
  
      emit('friendAdded');
      closeModal();
    } catch (err) {
      console.error('Error adding friend:', err);
      error.value = 'An error occurred while adding friend. Please try again.';
    } finally {
      isLoading.value = false;
    }
  };
  
  const copyInviteLink = () => {
    inviteLinkInput.value.select();
    document.execCommand('copy');
    alert('Invite link copied! You can now share it with your friend.');
  };
  </script>
