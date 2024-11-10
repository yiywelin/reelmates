// src/utils/imageUtils.js
// this page is for uploading images to firebase storage and updating the firestore database with the new image url


import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export const uploadGroupPhoto = async (file, groupId) => {
  try {
    // Create a storage reference
    const imageRef = storageRef(storage, `group-photos/${groupId}/${file.name}`)
    
    // Upload the file
    await uploadBytes(imageRef, file)
    
    // Get the download URL
    const photoURL = await getDownloadURL(imageRef)
    
    // Update Firestore
    const groupRef = doc(db, 'groups', groupId)
    await updateDoc(groupRef, {
      photoURL: photoURL
    })
    
    return photoURL
  } catch (error) {
    console.error('Error uploading photo:', error)
    throw error
  }
} 