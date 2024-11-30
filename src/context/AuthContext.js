import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({
  currentUser: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
      if (user) {
        console.log('User ID:', user.uid);
        console.log('Email verified:', user.emailVerified);
      }
      setCurrentUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
