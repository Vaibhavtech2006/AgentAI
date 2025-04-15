"use client";

import React from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { WavyBackground } from "@/components/ui/wavy-background";
import { GlareCard } from "@/components/ui/glare-card";

export default function AgentsPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden space-y-10">
      {/* CardSpotlight wrapped in a z-10 container to ensure visibility */}
      <div className="z-10 relative mt-20">
        <CardSpotlight className="h-64 w-64 p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600">
          <button className="text-2xl font-extrabold text-white text-center mt-2 shadow-md p-2 rounded-md hover:bg-white hover:text-black transition duration-300">
            Generate Your Lead
          </button>

          <div className="text-neutral-200 mt-4 text-sm font-medium">
            <p className="text-lg font-semibold text-white">Welcome to the Lead Generation Portal</p>
            <p className="mt-2">
              Start your journey to successful lead generation by following these simple steps:
            </p>
          </div>
        </CardSpotlight>
      </div>

      {/* GlareCard Section */}
      <div className="z-10 relative w-full max-w-6xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <GlareCard className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-white font-semibold text-lg">Set Meeting with Your Lead</p>
            <button className="bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded transition duration-300">
              Schedule Meeting
            </button>
          </GlareCard>

          <GlareCard className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-white font-semibold text-lg">Message Your Lead</p>
            <button className="bg-green-600 hover:bg-green-800 text-white font-medium py-2 px-4 rounded transition duration-300">
              Send Message
            </button>
          </GlareCard>

          <GlareCard className="flex flex-col items-center justify-center space-y-4 p-6">
            <p className="text-white font-semibold text-lg">Call Your Lead</p>
            <button className="bg-red-600 hover:bg-red-800 text-white font-medium py-2 px-4 rounded transition duration-300">
              Start Call
            </button>
          </GlareCard>
        </div>
      </div>

      {/* WavyBackground positioned behind using z-0 */}
      <div className="absolute inset-0 z-0">
        <WavyBackground className="max-w-4xl mx-auto pb-40" />
      </div>
    </div>
  );
}
