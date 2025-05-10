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