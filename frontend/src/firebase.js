// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyCGhHCQep1jcQn0HsjHWCfZquF4SgNbJnE",
  authDomain: "pizza-byte.firebaseapp.com",
  projectId: "pizza-byte",
  storageBucket: "pizza-byte.firebasestorage.app",
  messagingSenderId: "650275539779",
  appId: "1:650275539779:web:6d35f585c366b249c2fdf6",
  measurementId: "G-JQD6CDC1Q3"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();