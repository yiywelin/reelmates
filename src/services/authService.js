// src/services/authService.js

import { auth, db } from '../firebaseConfig';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  userDocRef 
} from 'firebase/firestore';
import defaultAvatar from '@/assets/images/default-avatar.png';

export const authService = {
  // Create new user
  async registerUser(email, password) {
    try {
      // 1. Create auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Set default avatar for new users
      await updateProfile(userCredential.user, {
        photoURL: defaultAvatar
      });
      
      // 3. Create Firestore user document
      await this.createUserDocument(userCredential.user);
      
      return {
        success: true,
        isNewUser: true,
        user: userCredential.user
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  },

  // Sign in existing user
  async loginUser(email, password) {
    try {
      // 1. Sign in user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if user is a new user
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      const userData = userDoc.data();

      if (userData?.isNewUser) {
        // Update isNewUser flag to false after first login
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...userData,
          isNewUser: false
        }, { merge: true });
      }
      
      // 2. Update last login timestamp
      await this.updateUserLastLogin(userCredential.user.uid);
      
      return {
        success: true,
        isNewUser: userData?.isNewUser || false,
        user: userCredential.user
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  },

  // Google Sign In
  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      let isNewUser = false;

      if (!userDoc.exists()) {
        isNewUser = true;
        await this.createUserDocument(userCredential.user);
      } else {
        const userData = userDoc.data();
        isNewUser = userData.isNewUser || false;
      
        await setDoc(userDocRef, {
          ...userData,
          lastLogin: serverTimestamp(),
          // If they were a new user, mark them as not new anymore
          ...(userData.isNewUser && { isNewUser: false })
        }, { merge: true });
        await this.updateUserLastLogin(userCredential.user.uid);
      }

      return {
        success: true,
        isNewUser,
        user: userCredential.user
      };
    } catch (error) {
      console.error("Google sign in error:", error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  },

  // Sign out
  async logout() {
    try {
      const userId = auth.currentUser?.uid;
      if (userId) {
        await this.updateUserLastActive(userId);
      }
      await signOut(auth);
      console.log("Sign out successful!")
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: this.handleAuthError(error)
      };
    }
  },

  // Create user document in Firestore
  async createUserDocument(user) {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        lastActive: serverTimestamp(),
        swipedMovies: [],
        likedMovies: [],
        friends: [],
        username: user.email.split('@')[0], // Basic username from email
        photoURL: defaultAvatar,
        isNewUser: true
      });
    } catch (error) {
      console.error("Error creating user document:", error);
      throw error;
    }
  },

  // Update last login timestamp
  async updateUserLastLogin(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        lastLoginAt: serverTimestamp(),
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating last login:", error);
      throw error;
    }
  },

  // Update last active timestamp
  async updateUserLastActive(userId) {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        lastActive: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating last active:", error);
      throw error;
    }
  },

  // Handle authentication errors
  handleAuthError(error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/popup-closed-by-user':
        return 'Google sign in was cancelled';
      default:
        return 'An error occurred. Please try again';
    }
  }
};