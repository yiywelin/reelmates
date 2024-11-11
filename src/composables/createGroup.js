import { addDoc, collection } from 'firebase/firestore'
import { db } from '@/firebase'

export const useGroups = () => {
  const createGroup = async (groupData) => {
    try {
      await addDoc(collection(db, 'groups'), groupData)
    } catch (error) {
      console.error('Error creating group:', error)
      throw error
    }
  }

  return {
    createGroup
  }
}