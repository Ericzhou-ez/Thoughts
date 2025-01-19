// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhmG7F9mYSNQs9C38WnM0FSqnZiqiDzk0",
  authDomain: "thoughts-8fb6a.firebaseapp.com",
  projectId: "thoughts-8fb6a",
  storageBucket: "thoughts-8fb6a.firebasestorage.app",
  messagingSenderId: "912510823106",
  appId: "1:912510823106:web:d6006984b02d777a9a695b",
  measurementId: "G-Q483839GXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app, firebaseConfig.storageBucket);