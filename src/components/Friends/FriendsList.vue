<template>
  <div>
    <!-- Existing friend list code -->
    <button 
      @click="openAddFriendModal"
      :class="{ 'pulse-attention': !hasFriends }"
      class="btn btn-primary"
    >
      Add Friend
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import '@/assets/styles/pulse.css'

export default {
  setup() {
    const hasFriends = ref(false)

    onMounted(async () => {
      // Check if user has friends
      const friendsList = await getFriends() // Your existing friend fetching logic
      hasFriends.value = friendsList.length > 0
    })

    return {
      hasFriends
    }
  }
}
</script> 
