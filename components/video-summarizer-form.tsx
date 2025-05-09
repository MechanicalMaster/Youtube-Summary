"use client"

import { useState, useEffect } from "react"
import { useFormStatus } from "react-dom"
import { summarizeYouTubeVideo } from "@/actions/summarize-video"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Copy, CheckCircle2, AlertCircle, RefreshCw, Clock } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { StructuredSummary } from "@/lib/openai-utils"
import { useAuth } from "@/components/auth-provider"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Generate Summary"
      )}
    </Button>
  )
}

export function VideoSummarizerForm() {
  const { user, updateUser } = useAuth()
  const [result, setResult] = useState<{
    structuredSummary?: StructuredSummary
    error?: string
    videoId?: string
    videoTitle?: string
    status?: string
    transcriptSource?: string
    remainingCredits?: number
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  
  // Log user data when it changes
  useEffect(() => {
    if (user) {
      console.log("VideoSummarizerForm - Current user data:", {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        credits: user.credits
      });
    } else {
      console.log("VideoSummarizerForm - No user data available");
    }
  }, [user]);

  async function handleSubmit(formData: FormData) {
    if (!user) {
      console.log("VideoSummarizerForm - Submit attempted with no user");
      setResult({ error: "You must be logged in to summarize videos" })
      return
    }
    
    // Add user data to the form data
    formData.append("userEmail", user.email)
    formData.append("userId", user.id)
    
    console.log("VideoSummarizerForm - Submitting with user data:", {
      id: user.id,
      email: user.email,
      credits: user.credits
    });
    
    setResult({ status: "processing" });
    setCurrentStep("Validating YouTube URL");

    try {
      // Simulate step progression for better UX
      setTimeout(() => setCurrentStep("Fetching video information"), 500);
      setTimeout(() => setCurrentStep("Retrieving transcript"), 1500);
      setTimeout(() => setCurrentStep("Generating summary with AI"), 3000);

      console.log("VideoSummarizerForm - Calling summarizeYouTubeVideo action");
      const response = await summarizeYouTubeVideo(formData);
      console.log("VideoSummarizerForm - Action response:", response);
      setResult(response);
      
      // Update user credits if the response includes remainingCredits
      if (response.remainingCredits !== undefined && user) {
        console.log("VideoSummarizerForm - Updating user credits:", {
          from: user.credits,
          to: response.remainingCredits
        });
        updateUser({ ...user, credits: response.remainingCredits });
      }
      
      setCurrentStep(null);
    } catch (error) {
      console.error("VideoSummarizerForm - Error in video summarization:", error);
      setResult({
        error: "An unexpected error occurred. Please try logging out and back in, then try again.",
      });
      setCurrentStep(null);
    }
  }

  function copyToClipboard() {
    if (result?.structuredSummary) {
      // Create a formatted text with the summary and sections
      let fullSummary = result.structuredSummary.overallSummary;
      fullSummary += "\n\n"; // Add two line breaks after the overall summary
      
      // Add each section with its title, timestamp, and content
      result.structuredSummary.sections.forEach((section) => {
        fullSummary += `## ${section.title} (${section.timestamp})\n`;
        fullSummary += `${section.content}\n\n`;
      });
      
      navigator.clipboard.writeText(fullSummary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function resetForm() {
    setResult(null);
    setCurrentStep(null);
  }

  return (
    <div className="space-y-6">
      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="youtubeUrl" className="text-sm font-medium">
            YouTube Video URL
          </label>
          <Input
            id="youtubeUrl"
            name="youtubeUrl"
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            required
            className="w-full"
          />
        </div>
        {user && (
          <div className="text-sm text-gray-500">
            You have <span className="font-semibold">{user.credits}</span> credits remaining
          </div>
        )}
        <SubmitButton />
      </form>

      {result?.status === "processing" && (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium">{currentStep || "Processing..."}</p>
          <p className="text-xs text-gray-500">This may take a few moments depending on the video length</p>
        </div>
      )}

      {result?.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      {result?.structuredSummary && (
        <Card className="overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {result.videoTitle && (
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold">Video Summary</h3>
                  <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-sm text-gray-500">{result.videoTitle}</p>
                {result.transcriptSource && (
                  <Badge variant="secondary" className="text-xs">
                    {result.transcriptSource}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Overall Summary */}
            <div className="prose prose-sm max-w-none bg-muted/50 p-4 rounded-md">
              <h4 className="text-base font-medium mb-2">Overview</h4>
              <p>{result.structuredSummary.overallSummary}</p>
            </div>
            
            {/* Sections with Timestamps */}
            <Accordion type="multiple" defaultValue={["section-0"]} className="w-full">
              {result.structuredSummary.sections.map((section, index) => (
                <AccordionItem key={index} value={`section-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span className="font-medium text-left">{section.title}</span>
                      <Badge variant="outline" className="ml-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{section.timestamp}</span>
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm">
                    <p className="py-2">{section.content}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            {result.videoId && (
              <div className="pt-2 border-t">
                <a
                  href={`https://www.youtube.com/watch?v=${result.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View original video
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(result?.structuredSummary || result?.error) && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={resetForm}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Summarize Another Video
          </Button>
        </div>
      )}
    </div>
  );
}
