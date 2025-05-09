"use server"

import { extractVideoId } from "@/lib/youtube-utils"
import { fetchTranscript, TranscriptSourceType } from "@/lib/transcript-fetcher"
import { generateSummary, StructuredSummary } from "@/lib/openai-utils"
import { getUserByEmail, updateUserCredits } from "@/lib/auth"
import { supabase } from "@/lib/supabase"

// Define the return type for the summarizeYouTubeVideo function
type SummarizeResult = {
  structuredSummary?: StructuredSummary;
  error?: string;
  videoId?: string;
  videoTitle?: string;
  transcriptSource?: TranscriptSourceType;
  remainingCredits?: number;
  status?: string;
}

export async function summarizeYouTubeVideo(formData: FormData): Promise<SummarizeResult> {
  const startTime = Date.now();
  console.log(`[${new Date().toISOString()}] SERVER ACTION START: summarizeYouTubeVideo`);
  
  const youtubeUrl = formData.get("youtubeUrl") as string
  const userEmail = formData.get("userEmail") as string
  const userId = formData.get("userId") as string

  console.log(`[${new Date().toISOString()}] Summarize request details:`, {
    youtubeUrlPrefix: youtubeUrl ? youtubeUrl.substring(0, 30) + '...' : 'MISSING',
    userEmail: userEmail || 'MISSING',
    userId: userId || 'MISSING'
  });

  // Step 1: Validate YouTube URL and user
  if (!youtubeUrl) {
    console.log(`[${new Date().toISOString()}] Error: No YouTube URL provided`);
    return { error: "Please enter a YouTube URL" }
  }
  
  if (!userEmail || !userId) {
    console.log(`[${new Date().toISOString()}] Error: Missing user information`, {
      userEmail: Boolean(userEmail),
      userId: Boolean(userId)
    });
    return { error: "You must be logged in to summarize videos" }
  }
  
  // Verify current auth session
  try {
    console.log(`[${new Date().toISOString()}] Verifying auth session`);
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData && sessionData.session) {
      console.log(`[${new Date().toISOString()}] Auth session found:`, {
        authUserId: sessionData.session.user.id,
        authUserEmail: sessionData.session.user.email,
        matchesProvidedId: sessionData.session.user.id === userId,
        matchesProvidedEmail: sessionData.session.user.email === userEmail,
      });
    } else {
      console.log(`[${new Date().toISOString()}] No active auth session found`);
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Error checking auth session:`, err);
  }
  
  // First, try to find the user by their ID (most reliable)
  try {
    console.log(`[${new Date().toISOString()}] Looking up user by ID: ${userId}`);
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle()
      
    if (error) {
      console.error(`[${new Date().toISOString()}] Database error when fetching user by ID:`, error);
    } else if (userData) {
      console.log(`[${new Date().toISOString()}] User found by ID:`, {
        id: userData.id,
        email: userData.email,
        display_name: userData.display_name,
        credits: userData.credits,
        timestamps: {
          created_at: userData.created_at,
          updated_at: userData.updated_at
        }
      });
      
      // Use the user data from direct lookup
      if (userData.credits <= 0) {
        console.log(`[${new Date().toISOString()}] User has insufficient credits:`, userData.credits);
        return { error: "You don't have enough credits. Please purchase more credits." }
      }
      
      // If we found the user by ID, proceed with summarization
      console.log(`[${new Date().toISOString()}] Proceeding with summarization for user found by ID`);
      return await generateSummaryForUser(youtubeUrl, userData, userId)
    } else {
      console.log(`[${new Date().toISOString()}] No user found with ID: ${userId}`);
      
      // Debug query - check if this user exists in auth but not in the users table
      try {
        const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
        console.log(`[${new Date().toISOString()}] Auth user lookup result:`, {
          found: Boolean(authUser?.user),
          error: authError ? authError.message : null,
          userId: authUser?.user?.id,
          userEmail: authUser?.user?.email,
        });
      } catch (authLookupErr) {
        console.error(`[${new Date().toISOString()}] Error looking up auth user:`, authLookupErr);
      }
      
      // Check if the users table exists and has records
      try {
        const { data: tableInfo, error: tableError } = await supabase
          .from('users')
          .select('count')
          .limit(1);
          
        console.log(`[${new Date().toISOString()}] Users table check:`, {
          tableExists: !tableError,
          error: tableError ? tableError.message : null,
          hasRecords: tableInfo && tableInfo.length > 0
        });
        
        // Debug - check what records exist in the users table
        const { data: userRecords, error: recordsError } = await supabase
          .from('users')
          .select('id, email')
          .limit(5);
          
        console.log(`[${new Date().toISOString()}] Sample user records:`, {
          error: recordsError ? recordsError.message : null,
          count: userRecords ? userRecords.length : 0,
          samples: userRecords ? userRecords.map(u => ({ id: u.id, email: u.email })) : []
        });
      } catch (tableErr) {
        console.error(`[${new Date().toISOString()}] Error checking users table:`, tableErr);
      }
    }
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Unexpected error looking up user by ID:`, err);
  }
  
  // If user lookup by ID failed, try falling back to email
  console.log(`[${new Date().toISOString()}] Falling back to email lookup for: ${userEmail}`);
  try {
    // Direct database query to check user by email
    const { data: emailUser, error: emailError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle();
      
    if (emailError) {
      console.error(`[${new Date().toISOString()}] Error in direct email lookup:`, emailError);
    } else if (emailUser) {
      console.log(`[${new Date().toISOString()}] User found directly by email:`, {
        id: emailUser.id, 
        email: emailUser.email,
        idMatch: emailUser.id === userId
      });
      
      if (emailUser.credits <= 0) {
        return { error: "You don't have enough credits. Please purchase more credits." }
      }
      
      return await generateSummaryForUser(youtubeUrl, emailUser, emailUser.id);
    } else {
      console.log(`[${new Date().toISOString()}] No user found by direct email lookup`);
    }
  } catch (directEmailErr) {
    console.error(`[${new Date().toISOString()}] Error in direct email query:`, directEmailErr);
  }
  
  // Fall back to the helper function
  const user = await getUserByEmail(userEmail)
  console.log(`[${new Date().toISOString()}] getUserByEmail result:`, {
    found: Boolean(user),
    id: user?.id,
    email: user?.email,
    credits: user?.credits
  });
  
  if (!user) {
    console.log(`[${new Date().toISOString()}] User not found by any method. Attempting to repair...`);
    
    // If we can't find the user by any method, try to verify and create
    try {
      console.log(`[${new Date().toISOString()}] Fetching auth user data for repair`);
      
      // Verify this is a real authenticated user
      const { data: authData } = await supabase.auth.getUser()
      console.log(`[${new Date().toISOString()}] Auth user data for repair:`, {
        found: Boolean(authData?.user),
        id: authData?.user?.id,
        email: authData?.user?.email,
        matchesId: authData?.user?.id === userId,
        matchesEmail: authData?.user?.email === userEmail
      });
      
      if (!authData || !authData.user || authData.user.id !== userId) {
        console.log(`[${new Date().toISOString()}] Auth verification failed`);
        return { error: "Session verification failed. Please log out and log back in." }
      }
      
      // Create the missing user record
      console.log(`[${new Date().toISOString()}] Attempting to create user record for:`, {
        id: userId,
        email: userEmail
      });
      
      const { data: newUserData, error: createError } = await supabase
        .from('users')
        .insert([
          { 
            id: userId,
            email: userEmail,
            display_name: authData.user.user_metadata?.displayName || null,
            credits: 10, // Default starting credits
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .maybeSingle()
        
      if (createError) {
        console.error(`[${new Date().toISOString()}] Failed to create user record:`, createError);
        return { error: "Could not create your user profile. Please contact support." }
      }
      
      if (newUserData) {
        console.log(`[${new Date().toISOString()}] Successfully created user record:`, {
          id: newUserData.id,
          email: newUserData.email,
          credits: newUserData.credits
        });
        return await generateSummaryForUser(youtubeUrl, newUserData, userId)
      } else {
        console.log(`[${new Date().toISOString()}] No user data returned after insert`);
        return { error: "Could not initialize your account. Please try again later." }
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error creating user record:`, error);
      return { error: "An unexpected error occurred. Please try logging out and back in." }
    }
  }
  
  console.log(`[${new Date().toISOString()}] User found with helper function:`, {
    id: user.id,
    email: user.email,
    credits: user.credits,
    idMatch: user.id === userId
  });
  
  if (user.credits <= 0) {
    return { error: "You don't have enough credits. Please purchase more credits." }
  }

  // Use the standard flow with the found user
  const result = await generateSummaryForUser(youtubeUrl, user, user.id);
  
  const totalTime = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] SERVER ACTION COMPLETE in ${totalTime}ms`);
  
  return result;
}

// Helper function to generate summary for a valid user
async function generateSummaryForUser(
  youtubeUrl: string, 
  user: any, 
  userId: string
): Promise<SummarizeResult> {
  console.log(`[${new Date().toISOString()}] Starting summary generation for user:`, {
    id: userId,
    credits: user.credits
  });
  
  // Extract video ID
  const videoId = extractVideoId(youtubeUrl)
  if (!videoId) {
    console.log(`[${new Date().toISOString()}] Invalid YouTube URL:`, youtubeUrl.substring(0, 30));
    return { error: "Please enter a valid YouTube URL" }
  }
  
  console.log(`[${new Date().toISOString()}] Extracted video ID:`, videoId);

  try {
    // Fetch transcript using the tier-based system
    console.log(`[${new Date().toISOString()}] Fetching transcript for video:`, videoId);
    const { transcript, videoTitle, transcriptSource } = await fetchTranscript(videoId)

    if (!transcript) {
      console.log(`[${new Date().toISOString()}] No transcript available for video:`, videoId);
      return { error: "Transcript not available for this video" }
    }

    // Log transcript length and source for debugging
    console.log(`[${new Date().toISOString()}] Transcript fetched:`, {
      length: transcript.length,
      source: transcriptSource,
      title: videoTitle
    });

    // Generate structured summary with sections and timestamps
    console.log(`[${new Date().toISOString()}] Generating summary`);
    const structuredSummary = await generateSummary(transcript)

    if (!structuredSummary || !structuredSummary.overallSummary) {
      console.log(`[${new Date().toISOString()}] Failed to generate summary`);
      return { error: "Unable to generate summary. Please try again later" }
    }
    
    console.log(`[${new Date().toISOString()}] Summary generated successfully:`, {
      summaryLength: structuredSummary.overallSummary.length,
      sections: structuredSummary.sections.length
    });

    // Deduct 1 credit from the user's account
    console.log(`[${new Date().toISOString()}] Updating credits:`, {
      userId,
      email: user.email,
      from: user.credits,
      to: user.credits - 1
    });
    
    // Update credits directly in the database
    const { data: updatedUserData, error: updateError } = await supabase
      .from('users')
      .update({ 
        credits: user.credits - 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle()
      
    if (updateError) {
      console.error(`[${new Date().toISOString()}] Error updating user credits:`, updateError);
      return { error: "Failed to update user credits" }
    }
    
    let remainingCredits = user.credits - 1; // Default to the expected value
    
    if (!updatedUserData) {
      console.log(`[${new Date().toISOString()}] No data returned from credits update, checking if update was applied...`);
      
      // Try to verify if the update was successful by fetching the current record
      try {
        const { data: refreshedUser, error: refreshError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();
          
        if (refreshError) {
          console.error(`[${new Date().toISOString()}] Error fetching updated user:`, refreshError);
        } else if (refreshedUser) {
          console.log(`[${new Date().toISOString()}] Fetched updated user data:`, {
            credits: refreshedUser.credits,
            expectedCredits: user.credits - 1,
            updated: refreshedUser.updated_at
          });
          
          // Use the fetched credits value
          remainingCredits = refreshedUser.credits;
          
          // Log success message
          console.log(`[${new Date().toISOString()}] Credits updated successfully (verified by fetch):`, {
            newCredits: remainingCredits
          });
        } else {
          console.log(`[${new Date().toISOString()}] Could not verify credit update, proceeding with expected value:`, remainingCredits);
        }
      } catch (refreshErr) {
        console.error(`[${new Date().toISOString()}] Unexpected error fetching updated user:`, refreshErr);
      }
    } else {
      // Use the returned credits value from the update
      remainingCredits = updatedUserData.credits;
      console.log(`[${new Date().toISOString()}] Credits updated successfully:`, {
        newCredits: remainingCredits
      });
    }
    
    // Return the result with transcript source information, structured summary, and remaining credits
    console.log(`[${new Date().toISOString()}] Returning successful result with ${remainingCredits} credits remaining`);
    return {
      structuredSummary,
      videoId,
      videoTitle,
      transcriptSource,
      remainingCredits,
    }
  } catch (error: any) {
    console.error(`[${new Date().toISOString()}] Error in generateSummaryForUser:`, error);
    return handleSummarizeError(error)
  }
}

function handleSummarizeError(error: any): SummarizeResult {
  console.log(`[${new Date().toISOString()}] Handling specific error:`, error.message || 'No error message');
  
  // Handle specific error types
  if (error.message === "TRANSCRIPT_NOT_AVAILABLE") {
    return { error: "Transcript not available for this video. The video may not have captions enabled." }
  } else if (error.message === "YOUTUBE_API_ERROR") {
    return { error: "Unable to retrieve video information. Please check the YouTube API key and try again later." }
  } else if (error.message === "OPENAI_API_ERROR") {
    return { error: "Unable to generate summary. Please check the OpenAI API key and try again later." }
  } else if (error.message === "NETWORK_ERROR") {
    return { error: "Network error. Please check your connection and try again." }
  } else if (error.message === "VIDEO_NOT_FOUND") {
    return { error: "The video could not be found. Please check the URL and try again." }
  }

  return { error: "An unexpected error occurred. Please try again." }
}
