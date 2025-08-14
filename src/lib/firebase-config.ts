
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseOptions } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Function to check if all required config values are present and not placeholders
function isConfigValid(config: FirebaseOptions): boolean {
  return Object.values(config).every(value => value && !value.startsWith('NEXT_PUBLIC_') && value !== 'CHANGE_ME');
}

// Initialize Firebase
let app;
let db: any = null;
let auth: any = null;

if (!isConfigValid(firebaseConfig)) {
  console.warn("Firebase config is invalid or contains placeholder values. Firebase features will be disabled. Please check your .env.local file.");
  // We don't initialize the app if the config is invalid.
  // This will prevent further Firebase errors down the line.
} else {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApp();
  }
  db = getFirestore(app);
  auth = getAuth(app);
}

// If the app couldn't be initialized, we export null or undefined objects.
// The rest of the app should handle these gracefully.
if (!app) {
    console.warn("Firebase app could not be initialized. Firebase features will be disabled.");
}

export { db, auth };
