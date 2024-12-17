import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, CACHE_SIZE_UNLIMITED } from "firebase/firestore";

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

// Initialize Firestore with settings
export const db = initializeFirestore(app, {
  cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  experimentalForceLongPolling: true // Use long polling for better connection stability
});

export default app;
