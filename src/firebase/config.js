import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0TaRtjDOcQgtTB0UI2XBv4zYYbeTg3FU",
  authDomain: "lets-stream-c09e3.firebaseapp.com",
  projectId: "lets-stream-c09e3",
  storageBucket: "lets-stream-c09e3.firebasestorage.app",
  messagingSenderId: "1080273996839",
  appId: "1:1080273996839:web:2b42f26b59f4e22ff91202",
  measurementId: "G-691PPKTFXS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time.
      console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.log('Persistence not supported');
    }
  });

export default app;
