"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { User, authenticateUser, createUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  signup: (email: string, password: string, name?: string, displayName?: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  updateUser: (user: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for Supabase session on mount and setup auth listener
  useEffect(() => {
    // Get current session and user
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const { data: sessionData } = await supabase.auth.getSession();
        
        if (sessionData.session) {
          // User is logged in, get profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', sessionData.session.user.id)
            .single();
            
          if (!userError && userData) {
            setUser({
              id: sessionData.session.user.id,
              email: sessionData.session.user.email!,
              displayName: userData.display_name,
              credits: userData.credits,
            });
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize auth
    initializeAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // Get user profile data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (!userError && userData) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              displayName: userData.display_name,
              credits: userData.credits,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    return authenticateUser(email, password);
  };

  const signup = async (email: string, password: string, name?: string, displayName?: string) => {
    return createUser(email, password, name, displayName);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      setUser(null);
    }
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    try {
      // Update display_name if it's being changed
      if (updates.displayName !== undefined) {
        const { error } = await supabase
          .from('users')
          .update({ 
            display_name: updates.displayName,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error updating user profile:', error.message);
          return;
        }
      }
      
      // Create updated user object
      const updatedUser = { ...user, ...updates };
      
      // Update state
      setUser(updatedUser);
    } catch (error) {
      console.error('Unexpected error updating user profile:', error);
    }
  };

  // Function to update the entire user object
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
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
