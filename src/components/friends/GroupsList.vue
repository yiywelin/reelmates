<template>
  <div>
    <!-- Existing groups list code -->
    <button 
      @click="openCreateGroupModal"
      :class="{ 'pulse-attention': !hasGroups }"
      class="btn btn-primary"
    >
      Create Group
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import '@/assets/styles/pulse.css'

export default {
  setup() {
    const hasGroups = ref(false)

    onMounted(async () => {
      // Check if user has groups
      const groupsList = await getGroups() // Your existing group fetching logic
      hasGroups.value = groupsList.length > 0
    })

    return {
      hasGroups
    }
  }
}
</script> 