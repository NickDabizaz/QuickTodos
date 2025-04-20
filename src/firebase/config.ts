'use client';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";
import logger from "../utils/logger";

const COMPONENT_NAME = 'FirebaseConfig';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDByKKI8dry-hM7f8uKvxkngdvgYConyiY",
  authDomain: "quicktodos-17a86.firebaseapp.com",
  projectId: "quicktodos-17a86",
  storageBucket: "quicktodos-17a86.firebasestorage.app",
  messagingSenderId: "694373462418",
  appId: "1:694373462418:web:4cd79e9606eb4b4dccd14b",
  measurementId: "G-QKJ8TZZYDE"
};

// Initialize Firebase
let app;
let db;
let analytics = null;

try {
  logger.debug(COMPONENT_NAME, "Initializing Firebase");
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Safely initialize analytics when supported (client-side only)
  if (typeof window !== 'undefined') {
    // We'll set up analytics async to avoid blocking render
    const initAnalytics = async () => {
      try {
        if (await isSupported()) {
          analytics = getAnalytics(app);
          logger.debug(COMPONENT_NAME, "Firebase Analytics initialized");
        }
      } catch (error) {
        logger.warn(COMPONENT_NAME, "Firebase Analytics not supported", error);
      }
    };
    
    initAnalytics();
  }
  
  logger.info(COMPONENT_NAME, "Firebase initialized successfully");
} catch (error) {
  logger.error(COMPONENT_NAME, "Error initializing Firebase", error);
}

export { app, db, analytics }; 