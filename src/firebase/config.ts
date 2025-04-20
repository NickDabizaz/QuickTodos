'use client';

// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAnalytics, isSupported, Analytics } from "firebase/analytics";
import logger from "../utils/logger";

const COMPONENT_NAME = 'FirebaseConfig';

// Your web app's Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let db: Firestore;
let analytics: Analytics | null = null;

try {
  logger.debug(COMPONENT_NAME, "Initializing Firebase");
  
  // Check if environment variables are loaded
  if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
    logger.warn(COMPONENT_NAME, "Firebase env variables not found. Make sure .env.local is set up correctly");
  }
  
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
        logger.warn(COMPONENT_NAME, "Firebase Analytics not supported", String(error));
      }
    };
    
    initAnalytics();
  }
  
  logger.info(COMPONENT_NAME, "Firebase initialized successfully");
} catch (error) {
  logger.error(COMPONENT_NAME, "Error initializing Firebase", String(error));
}

export { app, db, analytics }; 