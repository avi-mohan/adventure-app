// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, logEvent } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8tN-V0oaqigiQJ-7oLrRiWxToP18fS_U",
  authDomain: "kidobee-c1785.firebaseapp.com",
  projectId: "kidobee-c1785",
  storageBucket: "kidobee-c1785.firebasestorage.app",
  messagingSenderId: "834570509224",
  appId: "1:834570509224:web:c568ae44c0f455ae549b9d",
  measurementId: "G-21EGK0LWDG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Helper function for analytics events
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};

export { app, db, auth, storage, analytics };