// src/utils/imageUtils.js
// this page is for uploading images to firebase storage and updating the firestore database with the new image url


import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebaseConfig'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export const uploadGroupPhoto = async (file, groupId) => {
  try {
    // Create a metadata object
    const metadata = {
      contentType: file.type,
      customMetadata: {
        'Access-Control-Allow-Origin': '*'
      }
    }
    
    // Create a storage reference with a unique path
    const timestamp = Date.now()
    const path = `group-photos/${groupId}/${timestamp}_${file.name}`
    const fileRef = storageRef(storage, path)
    
    // Upload with metadata
    const snapshot = await uploadBytes(fileRef, file, metadata)
    
    // Get download URL
    const photoURL = await getDownloadURL(snapshot.ref)
    
    // Update Firestore
    const groupRef = doc(db, 'groups', groupId)
    await updateDoc(groupRef, {
      photoURL: photoURL
    })
    
    return photoURL
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
} 