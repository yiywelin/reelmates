// src/firebaseConfig.js

// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, getDoc, doc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyDbJrpGdM6mUDPD-iGTQK97Nz_iMtnQNGQ",
  authDomain: "wad2-20e6f.firebaseapp.com",
  projectId: "wad2-20e6f",
  storageBucket: "wad2-20e6f.appspot.com",
  messagingSenderId: "1075148882917",
  appId: "1:1075148882917:web:7279d743c8f7f78664250c",
  measurementId: "G-ELR7RHQCYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Set persistence to LOCAL (user stays logged in after page refresh)
setPersistence(auth, browserLocalPersistence);

export { app, auth, analytics, db, doc, getDoc, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, onAuthStateChanged };
