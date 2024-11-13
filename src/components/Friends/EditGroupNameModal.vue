<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-lg p-6 w-96 shadow-xl">
      <h2 class="text-xl font-bold mb-4">Edit Group Name</h2>
      
      <input
        v-model="newName"
        type="text"
        class="w-full bg-gray-700 text-white px-4 py-2 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter new group name"
        @keyup.enter="handleSave"
      />
      
      <div class="flex justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

const props = defineProps({
  group: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['close', 'updated'])

const newName = ref(props.group.name)

const handleSave = async () => {
  try {
    const groupRef = doc(db, 'groups', props.group.id)
    await updateDoc(groupRef, {
      name: newName.value
    })
    emit('updated', newName.value)
    emit('close')
  } catch (error) {
    console.error('Error updating group name:', error)
  }
}
</script> 