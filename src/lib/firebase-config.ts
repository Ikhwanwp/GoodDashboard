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

// Function to check if all required config values are present
function isConfigValid(config: FirebaseOptions): boolean {
  return Object.values(config).every(value => value);
}

// Initialize Firebase only if config is valid
const app = !getApps().length && isConfigValid(firebaseConfig)
  ? initializeApp(firebaseConfig)
  : getApp();

// Throw an error if the app couldn't be initialized.
// This makes it clear that the environment variables are missing.
if (!app) {
    throw new Error("Firebase config is invalid or missing. Please check your .env.local file.");
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
