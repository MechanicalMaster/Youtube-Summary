"use client";

import { VideoSummarizerForm } from "@/components/video-summarizer-form";

export default function DashboardPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-medium mb-4">Generate Video Summary</h2>
        <VideoSummarizerForm />
      </div>
    </div>
  );
} 