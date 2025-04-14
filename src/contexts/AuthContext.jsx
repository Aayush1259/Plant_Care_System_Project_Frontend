
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '@/firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';

// Create the authentication context
const AuthContext = createContext();

// Define the AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Simulate fetching user profile
        // In a real app, this would come from Firestore
        setUserProfile({
          uid: user.uid,
          name: user.displayName || 'Plant Lover',
          email: user.email,
          photoURL: user.photoURL || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + user.uid,
          joinedDate: 'May 2023',
          plantsCount: 7,
          postsCount: 3
        });
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register a new user
  const register = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  // Login an existing user
  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout the current user
  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    // Simulated update - in a real app, this would update Firestore
    setUserProfile(prevProfile => ({
      ...prevProfile,
      ...data
    }));

    return true;
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    register,
    login,
    loginWithGoogle,
    logout,
    resetPassword,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
