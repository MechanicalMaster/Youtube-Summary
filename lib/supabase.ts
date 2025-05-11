import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

// Check for environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env.local file.');
}

// Client for browser usage (with anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (with service role key)
// Only use this on the server-side, never expose this client to the browser
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase; // Fallback to regular client if service key not available

// User settings type
export type UserSettings = {
  id: string;
  user_id: string;
  mode: 'dark' | 'system' | 'light';
  default_action: 'open_reader' | 'concise_summary' | 'detailed_summary';
  search_language: string;
  created_at: string;
  updated_at: string;
};

// Fetch user settings
export async function fetchUserSettings(userId: string): Promise<{ settings: UserSettings | null, error: any }> {
  console.log(`[fetchUserSettings] Fetching settings for user:`, { userId });
  
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error) {
      console.error(`[fetchUserSettings] Error fetching settings:`, error);
      return { settings: null, error };
    }
    
    if (!data) {
      console.log(`[fetchUserSettings] No settings found, initializing defaults`);
      return await initializeUserSettings(userId);
    }
    
    console.log(`[fetchUserSettings] Settings retrieved successfully`);
    return { settings: data as UserSettings, error: null };
  } catch (err) {
    console.error(`[fetchUserSettings] Unexpected error:`, err);
    return { settings: null, error: err as any };
  }
}

// Update user settings
export async function updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<{ settings: UserSettings | null, error: any }> {
  console.log(`[updateUserSettings] Updating settings for user:`, { userId });
  
  try {
    const { data, error } = await supabase
      .from('user_settings')
      .update({ 
        ...updates, 
        updated_at: new Date().toISOString() 
      })
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error(`[updateUserSettings] Error updating settings:`, error);
      return { settings: null, error };
    }
    
    console.log(`[updateUserSettings] Settings updated successfully`);
    return { settings: data as UserSettings, error: null };
  } catch (err) {
    console.error(`[updateUserSettings] Unexpected error:`, err);
    return { settings: null, error: err as any };
  }
}

// Initialize user settings
export async function initializeUserSettings(userId: string): Promise<{ settings: UserSettings | null, error: any }> {
  console.log(`[initializeUserSettings] Initializing settings for user:`, { userId });
  
  try {
    // Default settings
    const defaultSettings = {
      user_id: userId,
      mode: 'system',
      default_action: 'concise_summary',
      search_language: 'English'
    };
    
    // Check if settings already exist
    const { data: existingSettings } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (existingSettings) {
      console.log(`[initializeUserSettings] Settings already exist, skipping initialization`);
      return await fetchUserSettings(userId);
    }
    
    // Create new settings
    const { data, error } = await supabase
      .from('user_settings')
      .insert([defaultSettings])
      .select('*')
      .maybeSingle();
    
    if (error) {
      console.error(`[initializeUserSettings] Error initializing settings:`, error);
      return { settings: null, error };
    }
    
    console.log(`[initializeUserSettings] Settings initialized successfully`);
    return { settings: data as UserSettings, error: null };
  } catch (err) {
    console.error(`[initializeUserSettings] Unexpected error:`, err);
    return { settings: null, error: err as any };
  }
}

// Fetch summaries for a user with pagination
export async function fetchUserSummaries(userId: string, page = 1, limit = 12) {
  console.log(`[fetchUserSummaries] Starting with params:`, { userId, page, limit });
  
  const offset = (page - 1) * limit;
  console.log(`[fetchUserSummaries] Calculated offset:`, { offset });
  
  try {
    // Get summaries
    const response = await supabase
      .from('summaries')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    console.log(`[fetchUserSummaries] Supabase response:`, {
      success: !response.error,
      errorDetails: response.error,
      dataCount: response.data?.length || 0, 
      totalCount: response.count
    });
    
    return { 
      summaries: response.data, 
      error: response.error, 
      count: response.count, 
      page, 
      limit 
    };
  } catch (err) {
    console.error(`[fetchUserSummaries] Unexpected error:`, err);
    return { summaries: null, error: err as any, count: 0, page, limit };
  }
}

// Fetch a single summary by ID
export async function fetchSummaryById(summaryId: string) {
  const { data: summary, error } = await supabase
    .from('summaries')
    .select('*')
    .eq('id', summaryId)
    .maybeSingle();
    
  return { summary, error };
}

export default supabase; 