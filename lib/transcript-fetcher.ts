import { YoutubeTranscript } from "youtube-transcript"

/**
 * Transcript source types in order of preference
 */
export enum TranscriptSourceType {
  OFFICIAL = "Official transcript",
  AUTO_GENERATED = "Auto-generated transcript",
  CAPTIONS = "Manual captions",
  AUTO_CAPTIONS = "Auto-generated captions",
  UNKNOWN = "Unknown source"
}

/**
 * Fetches the transcript for a YouTube video using a tier-based approach
 */
export async function fetchTranscript(videoId: string): Promise<{ 
  transcript: string; 
  videoTitle: string;
  transcriptSource: TranscriptSourceType;
}> {
  try {
    // First, get video details to get the title
    const videoDetailsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${process.env.YOUTUBE_API_KEY}`,
    )

    if (!videoDetailsResponse.ok) {
      console.error("YouTube API error:", await videoDetailsResponse.text())
      throw new Error("YOUTUBE_API_ERROR")
    }

    const videoDetails = await videoDetailsResponse.json()

    if (!videoDetails.items || videoDetails.items.length === 0) {
      throw new Error("VIDEO_NOT_FOUND")
    }

    const videoTitle = videoDetails.items[0].snippet.title

    // Try to fetch transcripts in order of preference
    const transcriptSources = [
      { type: TranscriptSourceType.OFFICIAL, options: { lang: "en" } },
      { type: TranscriptSourceType.AUTO_GENERATED, options: { lang: "en", auto: true } },
      { type: TranscriptSourceType.CAPTIONS, options: { lang: "en", captions: true } },
      { type: TranscriptSourceType.AUTO_CAPTIONS, options: { lang: "en", auto: true, captions: true } },
      // Fallback with no options as last resort
      { type: TranscriptSourceType.UNKNOWN, options: {} }
    ]

    let lastError: any = null;
    
    // Try each transcript source in order
    for (const source of transcriptSources) {
      try {
        console.log(`Attempting to fetch transcript with source: ${source.type}`)
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId, source.options)
        
        if (transcriptItems && transcriptItems.length > 0) {
          // Combine all transcript segments into a single string
          const fullTranscript = transcriptItems.map((item) => item.text).join(" ")
          console.log(`Successfully fetched transcript from source: ${source.type}`)
          
          return { 
            transcript: fullTranscript, 
            videoTitle,
            transcriptSource: source.type
          }
        }
      } catch (error) {
        console.error(`Error fetching transcript with source ${source.type}:`, error)
        lastError = error
        // Continue to next source
      }
    }

    // If we've tried all sources and none worked
    console.error("All transcript sources failed", lastError)
    throw new Error("TRANSCRIPT_NOT_AVAILABLE")
  } catch (error) {
    console.error("Error in fetchTranscript:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("TRANSCRIPT_NOT_AVAILABLE")
  }
}
