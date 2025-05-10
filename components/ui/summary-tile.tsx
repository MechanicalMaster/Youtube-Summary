import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { StructuredSummary } from '@/lib/openai-utils';
import { FileVideo } from 'lucide-react';

interface SummaryTileProps {
  id: string;
  videoId: string;
  videoTitle: string;
  summaryData: StructuredSummary;
  createdAt: string;
}

export function SummaryTile({ id, videoId, videoTitle, summaryData, createdAt }: SummaryTileProps) {
  const [imgError, setImgError] = useState(false);
  
  // Format date as "3 days ago" or similar
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  
  // Truncate summary to 120 characters
  const truncatedSummary = summaryData.overallSummary.length > 120 
    ? `${summaryData.overallSummary.substring(0, 120)}...` 
    : summaryData.overallSummary;
  
  // YouTube thumbnail URL
  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
  
  return (
    <Link href={`/summary/${id}`} className="block">
      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-200">
        <div className="aspect-video relative bg-gray-100">
          {imgError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <FileVideo className="h-12 w-12 text-gray-400" />
            </div>
          ) : (
            <Image 
              src={thumbnailUrl} 
              alt={videoTitle}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          )}
        </div>
        <CardHeader className="p-4 pb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{videoTitle}</h3>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="text-sm text-muted-foreground line-clamp-3">{truncatedSummary}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">
          {formattedDate}
        </CardFooter>
      </Card>
    </Link>
  );
}

export default SummaryTile; 