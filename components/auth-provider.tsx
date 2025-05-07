"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, authenticateUser, createUser, DUMMY_USERS } from "@/lib/auth";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string, name?: string, displayName?: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (updates: Partial<User>) => void;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const authenticatedUser = authenticateUser(email, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      localStorage.setItem("user", JSON.stringify(authenticatedUser));
    }
    return authenticatedUser;
  };

  const signup = async (email: string, password: string, name?: string, displayName?: string) => {
    const newUser = createUser(email, password, name, displayName);
    if (newUser) {
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    }
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    
    // Create updated user object
    const updatedUser = { ...user, ...updates };
    
    // Update state and localStorage
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    // In a real app, we would also update the database
    // For this demo, we'll just update our DUMMY_USERS array
    const userIndex = DUMMY_USERS.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      // Update everything except password which isn't in the User type
      DUMMY_USERS[userIndex] = {
        ...DUMMY_USERS[userIndex],
        ...updates
      };
    }
  };

  // Function to update the entire user object
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isLoading,
        updateUserProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
