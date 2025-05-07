// Simple auth context for demonstration purposes

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

export function authenticateUser(email: string, password: string): User | null {
  const user = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password
  );
  
  if (!user) return null;
  
  // Return user without password
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    displayName: user.displayName,
    credits: user.credits,
  };
}

export function getUserByEmail(email: string): User | null {
  return DUMMY_USERS.find((user) => user.email === email) || null;
}

export function updateUserCredits(email: string, newCredits: number): User | null {
  const userIndex = DUMMY_USERS.findIndex((user) => user.email === email);
  if (userIndex === -1) {
    return null;
  }
  
  // Update user credits
  DUMMY_USERS[userIndex] = {
    ...DUMMY_USERS[userIndex],
    credits: newCredits,
  };
  
  return {
    id: DUMMY_USERS[userIndex].id,
    email: DUMMY_USERS[userIndex].email,
    name: DUMMY_USERS[userIndex].name,
    displayName: DUMMY_USERS[userIndex].displayName,
    credits: DUMMY_USERS[userIndex].credits,
  };
}

export function createUser(email: string, password: string, name?: string, displayName?: string): User | null {
  // Check if user already exists
  const existingUser = DUMMY_USERS.find((u) => u.email === email);
  if (existingUser) return null;
  
  // In a real app, we would create a user in the database
  // For this demo, we'll just add to our array (but this won't persist across page refreshes)
  const newUser = {
    id: String(DUMMY_USERS.length + 1),
    email,
    password,
    name,
    displayName: displayName || name, // Use name as displayName if not provided
    credits: 10, // Give new users 10 credits by default
  };
  
  DUMMY_USERS.push(newUser);
  
  // Return user without password
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    displayName: newUser.displayName,
    credits: newUser.credits,
  };
}
