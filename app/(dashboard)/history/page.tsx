"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth-provider";
import { fetchUserSummaries } from "@/lib/supabase";
import { SummaryTile } from "@/components/ui/summary-tile";
import { CustomPagination } from "@/components/custom-pagination";
import { deleteSummary } from "@/actions/delete-summary";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export default function HistoryPage() {
  const { user } = useAuth();
  const [summaries, setSummaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 12; // Number of summaries per page
  
  // Delete confirmation state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [summaryToDelete, setSummaryToDelete] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
  
  const handleDeleteClick = (id: string, title: string) => {
    console.log("Delete clicked for summary:", { id, title });
    setSummaryToDelete({ id, title });
    setIsDeleteDialogOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!summaryToDelete || !user) return;
    
    console.log("Confirming deletion of summary:", summaryToDelete.id);
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      const result = await deleteSummary(summaryToDelete.id, user.id);
      
      if (result.success) {
        console.log("Summary deleted successfully");
        // Remove the deleted summary from the state
        setSummaries(summaries.filter(summary => summary.id !== summaryToDelete.id));
        
        // If we deleted the last item on the page and it's not the first page, go to previous page
        if (summaries.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } else {
        console.error("Error deleting summary:", result.error);
        setDeleteError(result.error || "Failed to delete summary");
      }
    } catch (err: any) {
      console.error("Unexpected error in deletion:", err);
      setDeleteError(err.message || "An unexpected error occurred");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setSummaryToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSummaryToDelete(null);
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
      
      {deleteError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{deleteError}</AlertDescription>
        </Alert>
      )}
      
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
                onDelete={handleDeleteClick}
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the summary for '{summaryToDelete?.title}'?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel} disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 