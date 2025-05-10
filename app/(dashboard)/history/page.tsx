"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { fetchUserSummaries } from "@/lib/supabase";
import { SummaryTile } from "@/components/ui/summary-tile";
import { CustomPagination } from "@/components/custom-pagination";

export default function HistoryPage() {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12; // Number of summaries per page

  useEffect(() => {
    console.log("History page useEffect triggered", { 
      userExists: !!user,
      userId: user?.id,
      currentPage
    });
    
    if (user?.id) {
      loadSummaries(user.id, currentPage);
    }
  }, [user, currentPage]);

  const loadSummaries = async (userId: string, page: number) => {
    console.log("Loading summaries...", { userId, page, limit });
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching summaries from Supabase...");
      const { summaries, error, count } = await fetchUserSummaries(userId, page, limit);
      
      console.log("Fetch result:", { 
        success: !error, 
        errorMessage: error?.message, 
        summariesCount: summaries?.length || 0,
        totalCount: count
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("Summaries data:", summaries);
      setSummaries(summaries || []);
      
      // Calculate total pages
      const total = Math.ceil((count || 0) / limit);
      console.log("Pagination info:", { total, currentPage });
      setTotalPages(total || 1);
    } catch (err: any) {
      console.error("Error fetching summaries:", err);
      setError(err.message || "Failed to load summaries");
      setSummaries([]);
    } finally {
      console.log("Finished loading summaries");
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    console.log("Page changed to:", page);
    setCurrentPage(page);
  };

  console.log("Rendering history page", { 
    user: !!user, 
    loading, 
    error, 
    summariesCount: summaries.length,
    currentPage,
    totalPages
  });

  if (!user) {
    return <div className="text-center py-12">Please log in to view your history.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Your Summary History</h1>
      
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : summaries.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <h3 className="text-lg mb-2">No summaries yet</h3>
          <p className="text-gray-500">
            You haven't created any summaries yet. Go to the dashboard to summarize a YouTube video.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {summaries.map((summary) => (
              <SummaryTile
                key={summary.id}
                id={summary.id}
                videoId={summary.video_id}
                videoTitle={summary.video_title}
                summaryData={summary.summary_data}
                createdAt={summary.created_at}
              />
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <CustomPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
} 