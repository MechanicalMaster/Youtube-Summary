"use server"

import { extractVideoId } from "@/lib/youtube-utils"
import { fetchTranscript, TranscriptSourceType } from "@/lib/transcript-fetcher"
import { generateSummary, StructuredSummary } from "@/lib/openai-utils"
import { getUserByEmail, updateUserCredits } from "@/lib/auth"

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
  const youtubeUrl = formData.get("youtubeUrl") as string
  const userEmail = formData.get("userEmail") as string

  // Step 1: Validate YouTube URL and user
  if (!youtubeUrl) {
    return { error: "Please enter a YouTube URL" }
  }
  
  if (!userEmail) {
    return { error: "You must be logged in to summarize videos" }
  }
  
  // Check if user has enough credits
  const user = getUserByEmail(userEmail)
  if (!user) {
    return { error: "User not found" }
  }
  
  if (user.credits <= 0) {
    return { error: "You don't have enough credits. Please purchase more credits." }
  }

  // Step 2: Extract video ID
  const videoId = extractVideoId(youtubeUrl)
  if (!videoId) {
    return { error: "Please enter a valid YouTube URL" }
  }

  try {
    // Step 3: Fetch transcript using the tier-based system
    const { transcript, videoTitle, transcriptSource } = await fetchTranscript(videoId)

    if (!transcript) {
      return { error: "Transcript not available for this video" }
    }

    // Log transcript length and source for debugging
    console.log(`Transcript fetched successfully. Length: ${transcript.length} characters, Source: ${transcriptSource}`)

    // Step 4: Generate structured summary with sections and timestamps
    const structuredSummary = await generateSummary(transcript)

    if (!structuredSummary || !structuredSummary.overallSummary) {
      return { error: "Unable to generate summary. Please try again later" }
    }

    // Step 5: Deduct 1 credit from the user's account
    const updatedUser = updateUserCredits(userEmail, user.credits - 1)
    if (!updatedUser) {
      return { error: "Failed to update user credits" }
    }
    
    // Step 6: Return the result with transcript source information, structured summary, and remaining credits
    return {
      structuredSummary,
      videoId,
      videoTitle,
      transcriptSource,
      remainingCredits: updatedUser.credits,
    }
  } catch (error: any) {
    console.error("Error in summarizeYouTubeVideo:", error)

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
}
