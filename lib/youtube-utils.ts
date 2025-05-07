/**
 * Extracts the YouTube video ID from various URL formats
 */
export function extractVideoId(url: string): string | null {
  if (!url) return null

  // Handle standard YouTube URLs (youtube.com/watch?v=VIDEO_ID)
  const standardRegex = /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/v\/|youtu\.be\/)([^&?/]+)/
  const standardMatch = url.match(standardRegex)
  if (standardMatch && standardMatch[1]) {
    return standardMatch[1]
  }

  // Handle YouTube short URLs (youtu.be/VIDEO_ID)
  const shortRegex = /youtu\.be\/([^&?/]+)/
  const shortMatch = url.match(shortRegex)
  if (shortMatch && shortMatch[1]) {
    return shortMatch[1]
  }

  // Handle YouTube embed URLs (youtube.com/embed/VIDEO_ID)
  const embedRegex = /youtube\.com\/embed\/([^&?/]+)/
  const embedMatch = url.match(embedRegex)
  if (embedMatch && embedMatch[1]) {
    return embedMatch[1]
  }

  return null
}
