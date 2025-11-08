import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBXZm630z7f8cE8gjGshUj0oAaRYT11eGE",
  authDomain: "loanpathfinder-dce3a.firebaseapp.com",
  projectId: "loanpathfinder-dce3a",
  storageBucket: "loanpathfinder-dce3a.firebasestorage.app",
  messagingSenderId: "1011702380455",
  appId: "1:1011702380455:web:656fdbd1c24cba6a4e2882",
  measurementId: "G-Y639N12X76"
};

// Initialize Firebase
let app;
let auth;
let db;
let analytics;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  // Initialize Analytics only in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  // Fallback: try to get default app
  try {
    app = initializeApp(firebaseConfig, "LoanPathfinder");
    auth = getAuth(app);
    db = getFirestore(app);
    if (typeof window !== 'undefined') {
      analytics = getAnalytics(app);
    }
  } catch (fallbackError) {
    console.error("Firebase fallback initialization error:", fallbackError);
    throw new Error("Failed to initialize Firebase. Please check your configuration.");
  }
}

export { auth, app, db, analytics };

