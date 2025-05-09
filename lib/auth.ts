// Simple auth context for demonstration purposes

import { supabase } from './supabase';

export type User = {
  id: string;
  email: string;
  name?: string;
  displayName?: string;
  credits: number;
};

// User with password for internal use
type UserWithPassword = {
  id: string;
  email: string;
  password: string;
  name?: string;
  displayName?: string;
  credits: number;
};

// Dummy user credentials for demonstration
export const DUMMY_USERS: UserWithPassword[] = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123",
    name: "Demo User",
    displayName: "Demo",
    credits: 10,
  },
];

/**
 * Authenticates a user with their email and password
 */
export async function authenticateUser(email: string, password: string): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Authentication error:', error.message);
      return null;
    }

    if (!data.user) {
      return null;
    }

    // Get user profile data from the users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user data:', userError.message);
      return null;
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      displayName: userData.display_name,
      credits: userData.credits,
    };
  } catch (error) {
    console.error('Unexpected error during authentication:', error);
    return null;
  }
}

/**
 * Returns user information by email
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    // Query the users table by email
    const { data: authUser, error: authError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors

    if (authError) {
      console.error('Error fetching user by email:', authError.message);
      return null;
    }

    if (!authUser) {
      console.log(`No user found with email: ${email}`);
      return null;
    }

    return {
      id: authUser.id,
      email: authUser.email,
      displayName: authUser.display_name,
      credits: authUser.credits,
    };
  } catch (error) {
    console.error('Unexpected error fetching user by email:', error);
    return null;
  }
}

/**
 * Updates user credits
 */
export async function updateUserCredits(email: string, newCredits: number): Promise<User | null> {
  try {
    // Direct query to update credits by email instead of querying by ID first
    const { data, error } = await supabase
      .from('users')
      .update({ 
        credits: newCredits, 
        updated_at: new Date().toISOString() 
      })
      .eq('email', email)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error updating user credits:', error.message);
      return null;
    }

    if (!data) {
      console.error('User not found when updating credits for email:', email);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      displayName: data.display_name,
      credits: data.credits,
    };
  } catch (error) {
    console.error('Unexpected error updating user credits:', error);
    return null;
  }
}

/**
 * Creates a new user
 */
export async function createUser(
  email: string, 
  password: string, 
  name?: string, 
  displayName?: string
): Promise<User | null> {
  try {
    // Create the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          displayName: displayName || name,
        },
      },
    });

    if (error) {
      console.error('Error creating user:', error.message);
      return null;
    }

    if (!data.user) {
      return null;
    }

    // Implementation of retry logic with exponential backoff
    // This helps with race conditions between auth creation and trigger execution
    let userData = null;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      attempts++;
      
      // Exponential backoff: 500ms, 1000ms, 2000ms, 4000ms, 8000ms
      const delay = Math.min(500 * Math.pow(2, attempts - 1), 8000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Try to get the user data
      const { data: fetchedUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to avoid the error

      if (userError) {
        console.log(`Attempt ${attempts} failed: ${userError.message}`);
        if (attempts === maxAttempts) {
          console.error('Max attempts reached. Error fetching new user data:', userError.message);
          return null;
        }
        continue; // Try again
      }

      // If we got user data, break out of the loop
      if (fetchedUser) {
        userData = fetchedUser;
        break;
      }

      // If no data but also no error, and we haven't reached max attempts, try again
      console.log(`Attempt ${attempts}: User record not found yet. Retrying...`);
    }

    // If we couldn't get user data after all attempts
    if (!userData) {
      console.error('Could not fetch user data after multiple attempts');
      
      // As a fallback, create a minimal user object from auth data
      return {
        id: data.user.id,
        email: data.user.email!,
        displayName: displayName || name,
        credits: 10, // Default credits
      };
    }

    return {
      id: data.user.id,
      email: data.user.email!,
      displayName: userData.display_name,
      credits: userData.credits,
    };
  } catch (error) {
    console.error('Unexpected error creating user:', error);
    return null;
  }
}
