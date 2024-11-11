// src/composables/useFriends.js

import { ref, computed } from 'vue'
import { getAuth } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebaseConfig'

export function useFriends() {
  const friends = ref([])
  const isFetchingFriends = ref(false)
  const friendsError = ref(null)

  const fetchFriends = async () => {
    isFetchingFriends.value = true
    friendsError.value = null

    try {
      const auth = getAuth()
      if (!auth.currentUser) {
        throw new Error('No authenticated user')
      }

      // Get current user's document directly using doc()
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
      
      if (!userDoc.exists()) {
        console.log('User document not found')
        friends.value = []
        return
      }

      const userData = userDoc.data()
      const friendIds = userData.friends || []

      // Fetch each friend's data individually using doc()
      const friendsData = await Promise.all(
        friendIds.map(async (friendId) => {
          const friendDoc = await getDoc(doc(db, 'users', friendId))
          if (friendDoc.exists()) {
            const data = friendDoc.data()
            return {
              id: friendId,
              name: data.displayName || data.email || 'Unknown User',
              email: data.email || '',
              avatar: data.photoURL || null
            }
          }
          return null
        })
      )

      friends.value = friendsData.filter(friend => friend !== null)
    } catch (error) {
      console.error('Error fetching friends:', error)
      friendsError.value = 'Failed to fetch friends. Please try again.'
    } finally {
      isFetchingFriends.value = false
    }
  }

  const filteredFriends = computed(() => {
    return friends.value || []
  })

  return {
    friends,
    isFetchingFriends,
    friendsError,
    fetchFriends,
    filteredFriends
  }
}