import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from './config';
import { initializeUserDocument } from './userService';

// Email/Password Sign Up
export const registerWithEmailAndPassword = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with display name
    await updateProfile(userCredential.user, { displayName });
    // Initialize user document in Firestore
    await initializeUserDocument(userCredential.user.uid, displayName, email);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Email/Password Sign In
export const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

// Google Sign In
const googleProvider = new GoogleAuthProvider();
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Initialize user document in Firestore for Google sign-in
    await initializeUserDocument(
      result.user.uid, 
      result.user.displayName, 
      result.user.email
    );
    return result.user;
  } catch (error) {
    throw error;
  }
};

// Sign Out
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

// Get Current User
export const getCurrentUser = () => {
  return auth.currentUser;
};
