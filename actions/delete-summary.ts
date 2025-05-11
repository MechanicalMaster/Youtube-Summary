"use server";

import { supabase, supabaseAdmin } from "@/lib/supabase";

type DeleteSummaryResult = {
  success: boolean;
  error?: string;
};

export async function deleteSummary(summaryId: string, userId: string): Promise<DeleteSummaryResult> {
  console.log(`[${new Date().toISOString()}] SERVER ACTION START: deleteSummary`, {
    summaryId,
    userId: userId.substring(0, 8) + '...' // Log partial ID for privacy
  });
  
  if (!summaryId || !userId) {
    console.log(`[${new Date().toISOString()}] Error: Missing required parameters`);
    return { 
      success: false, 
      error: "Missing required parameters" 
    };
  }
  
  try {
    // First, verify that the summary belongs to the user
    console.log(`[${new Date().toISOString()}] Verifying summary ownership`);
    
    const { data: summary, error: fetchError } = await supabase
      .from('summaries')
      .select('user_id')
      .eq('id', summaryId)
      .maybeSingle();
      
    if (fetchError) {
      console.error(`[${new Date().toISOString()}] Error fetching summary:`, fetchError);
      return { 
        success: false, 
        error: "Error verifying summary ownership" 
      };
    }
    
    if (!summary) {
      console.log(`[${new Date().toISOString()}] Summary not found:`, summaryId);
      return { 
        success: false, 
        error: "Summary not found" 
      };
    }
    
    // Check if the summary belongs to the user
    if (summary.user_id !== userId) {
      console.log(`[${new Date().toISOString()}] Permission denied: Summary does not belong to the user`, {
        summaryUserId: summary.user_id.substring(0, 8) + '...',
        requestUserId: userId.substring(0, 8) + '...'
      });
      return { 
        success: false, 
        error: "You don't have permission to delete this summary" 
      };
    }
    
    // Delete the summary using supabaseAdmin to bypass RLS
    console.log(`[${new Date().toISOString()}] Deleting summary:`, summaryId);
    
    const { error: deleteError } = await supabaseAdmin
      .from('summaries')
      .delete()
      .eq('id', summaryId);
      
    if (deleteError) {
      console.error(`[${new Date().toISOString()}] Error deleting summary:`, deleteError);
      return { 
        success: false, 
        error: "Failed to delete summary" 
      };
    }
    
    console.log(`[${new Date().toISOString()}] Summary deleted successfully:`, summaryId);
    return { success: true };
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Unexpected error in deleteSummary:`, error);
    return { 
      success: false, 
      error: "An unexpected error occurred" 
    };
  }
} 