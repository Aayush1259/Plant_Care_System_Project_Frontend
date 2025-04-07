
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, googleProvider, db, storage } from "@/firebase/config";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>, photoFile?: File) => Promise<void>;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL: string;
  joinedDate: string;
  plantsCount: number;
  postsCount: number;
  bio?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile data from Firestore
  const fetchUserProfile = async (user: User) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        // Create a profile if it doesn't exist
        const newProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || "Plant Lover",
          email: user.email || "",
          photoURL: user.photoURL || "",
          joinedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          }),
          plantsCount: 0,
          postsCount: 0
        };
        await setDoc(userDocRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Register new user
  const register = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update the user's display name
      await updateProfile(user, { displayName: name });
      
      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: user.uid,
        name: name,
        email: user.email || "",
        photoURL: user.photoURL || "",
        joinedDate: new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
        }),
        plantsCount: 0,
        postsCount: 0
      };
      
      await setDoc(doc(db, "users", user.uid), userProfile);
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // Create user profile in Firestore
        const userProfile: UserProfile = {
          uid: user.uid,
          name: user.displayName || "Plant Lover",
          email: user.email || "",
          photoURL: user.photoURL || "",
          joinedDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
          }),
          plantsCount: 0,
          postsCount: 0
        };
        
        await setDoc(userDocRef, userProfile);
      }
      
      toast.success("Logged in with Google successfully!");
    } catch (error: any) {
      console.error("Google login error:", error);
      toast.error(error.message || "Failed to login with Google");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout");
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (data: Partial<UserProfile>, photoFile?: File) => {
    try {
      setIsLoading(true);
      
      if (!currentUser) throw new Error("No user logged in");
      
      let photoURL = data.photoURL || userProfile?.photoURL || "";
      
      // Upload new photo if provided
      if (photoFile) {
        const storageRef = ref(storage, `profile_photos/${currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
        
        // Update auth profile
        await updateProfile(currentUser, { photoURL });
      }
      
      // Update display name if provided
      if (data.name && data.name !== currentUser.displayName) {
        await updateProfile(currentUser, { displayName: data.name });
      }
      
      // Update Firestore profile
      const userDocRef = doc(db, "users", currentUser.uid);
      const updatedProfile = {
        ...userProfile,
        ...data,
        photoURL
      };
      
      await setDoc(userDocRef, updatedProfile, { merge: true });
      setUserProfile(updatedProfile as UserProfile);
      
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentUser,
    userProfile,
    isLoading,
    register,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
