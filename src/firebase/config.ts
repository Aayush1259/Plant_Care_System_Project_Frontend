
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb9WFMsE25X_HXGKXduWP1OMyD5XP14xI",
  authDomain: "plantcaresystem-34f70.firebaseapp.com",
  projectId: "plantcaresystem-34f70",
  storageBucket: "plantcaresystem-34f70.firebasestorage.app",
  messagingSenderId: "67008333961",
  appId: "1:67008333961:android:37d1fae5c3b08c8ba79e58"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
