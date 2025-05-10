"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, FileVideo } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { fetchSummaryById } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SummaryPage({ params }: { params: { id: string } }) {
  const { user } = useAuth();
  const router = useRouter();
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }
    
    const loadSummary = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { summary, error } = await fetchSummaryById(params.id);
        
        if (error) {
          throw new Error(error.message);
        }
        
        if (!summary) {
          throw new Error("Summary not found");
        }
        
        // Check if the summary belongs to the current user
        if (summary.user_id !== user.id) {
          throw new Error("You don't have permission to view this summary");
        }
        
        setSummary(summary);
      } catch (err: any) {
        console.error("Error fetching summary:", err);
        setError(err.message || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };
    
    loadSummary();
  }, [params.id, user]);

  if (!user) {
    return <div className="text-center py-12">Please log in to view this summary.</div>;
  }
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/history">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to History
          </Link>
        </Button>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  if (!summary) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <Button variant="outline" asChild className="mb-4">
          <Link href="/history">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to History
          </Link>
        </Button>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Summary not found
        </div>
      </div>
    );
  }
  
  const youtubeUrl = `https://www.youtube.com/watch?v=${summary.video_id}`;
  const thumbnailUrl = `https://img.youtube.com/vi/${summary.video_id}/maxresdefault.jpg`;
  const formattedDate = new Date(summary.created_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="max-w-4xl mx-auto py-8">
      <Button variant="outline" asChild className="mb-6">
        <Link href="/history">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to History
        </Link>
      </Button>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Thumbnail and Title */}
        <div className="aspect-video relative bg-gray-100">
          {imgError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <FileVideo className="h-16 w-16 text-gray-400" />
            </div>
          ) : (
            <Image
              src={thumbnailUrl}
              alt={summary.video_title}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-2">{summary.video_title}</h1>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Summarized {formattedDate}
              </span>
              <Button size="sm" asChild>
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
                  Watch on YouTube
                </a>
              </Button>
            </div>
          </div>
          
          {/* Overall Summary */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Overall Summary</h2>
            <p className="text-gray-700">{summary.summary_data.overallSummary}</p>
          </div>
          
          {/* Key Points */}
          {summary.summary_data.keyPoints && summary.summary_data.keyPoints.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Key Points</h2>
              <ul className="list-disc list-inside space-y-1">
                {summary.summary_data.keyPoints.map((point: string, index: number) => (
                  <li key={index} className="text-gray-700">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Sections */}
          {summary.summary_data.sections && summary.summary_data.sections.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Detailed Breakdown</h2>
              <Accordion type="single" collapsible className="w-full">
                {summary.summary_data.sections.map((section: any, index: number) => (
                  <AccordionItem key={index} value={`section-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="text-left">
                        <span className="font-medium">{section.title}</span>
                        {section.timestamp && (
                          <span className="text-xs text-muted-foreground ml-2">
                            {section.timestamp}
                          </span>
                        )}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {section.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 