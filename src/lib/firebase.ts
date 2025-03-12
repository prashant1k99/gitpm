// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBzbivV16j-uTHLTnAML4Vdq82uGHTcwsE",
  authDomain: "gitpm-91e61.firebaseapp.com",
  projectId: "gitpm-91e61",
  storageBucket: "gitpm-91e61.firebasestorage.app",
  messagingSenderId: "67664874897",
  appId: "1:67664874897:web:d521a4c852352793665e30",
  measurementId: "G-DYL4X8JWM2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  analytics,
  auth,
  db
}
