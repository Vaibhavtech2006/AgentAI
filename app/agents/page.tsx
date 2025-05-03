"use client";

import React from "react";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { WavyBackground } from "@/components/ui/wavy-background";
import { GlareCard } from "@/components/ui/glare-card";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import Link from 'next/link';



import { useRouter } from 'next/navigation';  

const stickyContent = [
  {
    title: "Connect with Your Leads",
    description: "Build strong relationships by understanding your lead's needs and preferences.",
    content: (
      <div className="p-4 text-white">
        <h3 className="text-xl font-bold mb-2">Lead Insights</h3>
        <p>Analyze your lead's behavior to personalize your approach.</p>
      </div>
    ),
  },
  {
    title: "Schedule Meetings",
    description: "Set up timely and impactful meetings to move your leads down the funnel.",
    content: (
      <div className="p-4 text-white">
        <h3 className="text-xl font-bold mb-2">Meeting Scheduler</h3>
        <p>Use our tools to find the best time to meet your prospects.</p>
      </div>
    ),
  },
  {
    title: "Close Deals Faster",
    description: "Convert more leads with streamlined communication and follow-ups.",
    content: (
      <div className="p-4 text-white">
        <h3 className="text-xl font-bold mb-2">CRM Integration</h3>
        <p>Sync all your data and track progress in real-time.</p>
      </div>
    ),
  },
];

const testimonials = [
  {
    quote: "This tool transformed how we reach our leads!",
    name: "Ananya Sharma",
    title: "Marketing Head, BrightFuture Inc.",
  },
  {
    quote: "This tool transformed how we reach our leads!",
    name: "Ananya Sharma",
    title: "Marketing Head, BrightFuture Inc.",
  },
  {
    quote: "The UI is amazing and the experience is smooth.",
    name: "Rohan Verma",
    title: "Sales Manager, QuickSales",
  },
  {
    quote: "My leads conversion rate has doubled!",
    name: "Priya Desai",
    title: "Freelance Consultant",
  },
  {
    quote: "Absolutely love the integration with our CRM system.",
    name: "Vikram Singh",
    title: "CEO, LeadLink",
  },
];

export default function AgentsPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black overflow-hidden space-y-10">
      {/* Spotlight Card */}
      <div className="z-10 relative mt-20">
        <CardSpotlight className="h-64 w-64 p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600">
        <Link href="/agents/chatbot">

            <div className="group flex items-center justify-center gap-2 text-2xl font-extrabold text-white text-center mt-2 shadow-md p-2 rounded-md hover:bg-white hover:text-black transition duration-300 cursor-pointer">
              Generate Your Lead
              <span className="transition-transform transform group-hover:translate-x-1 duration-300">
                ➜
              </span>
            </div>
          </Link>

          <div className="text-neutral-200 mt-4 text-sm font-medium">
            <p className="text-lg font-semibold text-white">Welcome to the Lead Generation Portal</p>
            <p className="mt-2">
              Start your journey to successful lead generation by following these simple steps:
            </p>
          </div>
        </CardSpotlight>
      </div>

      {/* Glare Cards */}
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

      {/* Sticky Scroll Reveal */}
      <div className="z-10 w-full max-w-6xl px-4">
        <StickyScroll content={stickyContent} />
      </div>

      {/* Infinite Moving Cards */}
      <div className="z-10 w-full px-4">
        <InfiniteMovingCards
          items={testimonials}
          direction="left"
          speed="fast"
          pauseOnHover={true}
        />
      </div>

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <WavyBackground className="max-w-4xl mx-auto pb-40" />
      </div>
    </div>
  );
}