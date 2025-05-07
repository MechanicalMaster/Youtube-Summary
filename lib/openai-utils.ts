import { OpenAI } from "openai"

/**
 * Interface for structured summary with sections and timestamps
 */
export interface StructuredSummary {
  overallSummary: string;
  sections: {
    title: string;
    content: string;
    timestamp: string;
  }[];
}

/**
 * Generates a structured summary of the transcript using OpenAI's API
 */
export async function generateSummary(transcript: string): Promise<StructuredSummary> {
  try {
    // Prepare the transcript for summarization
    const processedTranscript = processTranscript(transcript)

    // Log for debugging
    console.log(`Processed transcript length: ${processedTranscript.length} characters`)

    // Initialize the OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Generate the structured summary using OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4.1", // Using GPT-4 for better structure understanding
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that creates structured summaries of YouTube video transcripts. You break down the content into logical sections with timestamps and provide concise summaries for each section.",
        },
        {
          role: "user",
          content: `Analyze the following YouTube video transcript and create a structured summary with the following components:

          1. An overall summary of the entire video (100 words or less)
          2. 4-6 logical sections based on the content, each with:
             - A short, descriptive title for the section
             - A concise summary of that section (30-50 words)
             - An approximate timestamp (in MM:SS format) where that section ends
          
          Format your response as valid JSON with this structure:
          {
            "overallSummary": "The overall summary text...",
            "sections": [
              {
                "title": "Section Title",
                "content": "Section summary text...",
                "timestamp": "MM:SS"
              },
              ...more sections...
            ]
          }
          
          Here is the transcript:
          ${processedTranscript}
          
          Ensure your response is valid JSON that can be parsed directly.`,
        },
      ],
      max_tokens: 1000,
      response_format: { type: "json_object" },
    })

    // Extract and parse the JSON response
    const jsonResponse = response.choices[0]?.message?.content?.trim() || "{}"
    const structuredSummary: StructuredSummary = JSON.parse(jsonResponse)
    
    // Validate the structure
    if (!structuredSummary.overallSummary) {
      structuredSummary.overallSummary = "Summary not available."
    }
    
    if (!Array.isArray(structuredSummary.sections) || structuredSummary.sections.length === 0) {
      structuredSummary.sections = [{
        title: "Content Overview",
        content: structuredSummary.overallSummary,
        timestamp: "00:00"
      }]
    }
    
    return structuredSummary
  } catch (error) {
    console.error("Error generating structured summary:", error)
    // Fallback to a simple structure if there's an error
    return {
      overallSummary: "Unable to generate summary due to an error.",
      sections: [{
        title: "Error",
        content: "There was an error processing this transcript. Please try again later.",
        timestamp: "00:00"
      }]
    }
  }
}

/**
 * Processes the transcript to prepare it for summarization
 * - Removes timestamps and speaker labels
 * - Truncates if necessary to fit within token limits
 */
function processTranscript(transcript: string): string {
  // Remove timestamps (e.g., [00:01:23])
  let processed = transcript.replace(/\[\d{2}:\d{2}:\d{2}\]/g, "")

  // Remove speaker labels (e.g., "Speaker 1:", "John:")
  processed = processed.replace(/^.+?:/gm, "")

  // Clean up extra whitespace
  processed = processed.replace(/\s+/g, " ").trim()

  // Truncate if necessary (assuming a conservative estimate of 4 chars per token)
  // GPT-3.5-turbo has a context window of ~4000 tokens, but we'll be conservative
  const maxChars = 12000 // Increased from 3000 to handle longer transcripts
  if (processed.length > maxChars) {
    processed = processed.substring(0, maxChars) + "..."
  }

  return processed
}
