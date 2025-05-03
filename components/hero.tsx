"use client";

import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { cn } from "@/utils/cn";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import { ClerkProvider, useUser } from "@clerk/nextjs";
import ColourfulText from "@/components/ui/colourful-text";
import Link from "next/link";

const Hero = () => {
  const { user } = useUser();
  const initial = user?.firstName?.charAt(0).toUpperCase() || "";

  return (
    <ClerkProvider>
      <section className="relative h-screen overflow-hidden bg-black text-white">

        {/* Background Effects */}
        <Spotlight
          className="-top-40 -left-20 md:left-10 md:top-20 h-screen animate-moveLeft"
          fill="white"
        />
        <Spotlight
          className="top-10 -left-40 md:left-20 h-[80vh] w-[50vw] animate-moveLeft"
          fill="purple"
        />
        <Spotlight
          className="-top-40 right-0 md:right-10 md:top-20 h-screen animate-moveRight"
          fill="white"
        />
        <Spotlight
          className="top-10 right-0 md:right-20 h-[80vh] w-[50vw] animate-moveRight"
          fill="purple"
        />

        {/* Grid Background */}
        <div className="h-full w-full absolute top-0 left-0">
          <div
            className={cn(
              "absolute inset-0",
              "[background-size:40px_40px]",
              "[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
            )}
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>

        {/* Navbar */}
        <nav className="flex justify-between items-center px-10 md:px-20 py-6 z-20 relative">
          <div className="text-2xl font-bold">
            <ColourfulText text="Vikriti.Ai" />
          </div>
          <div className="flex space-x-8 text-lg items-center">
            <Link href="/" className="hover:text-purple-400 transition-all duration-300">Home</Link>
            <Link href="#services" className="hover:text-purple-400 transition-all duration-300">Services</Link>
            <Link href="#plans" className="hover:text-purple-400 transition-all duration-300">Plans</Link>
            <Link href="#about" className="hover:text-purple-400 transition-all duration-300">About Us</Link>

            {/* Account Dropdown */}
            <div className="relative group">
              {/* Account Circle */}
              <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center cursor-pointer text-lg font-bold">
                {initial}
              </div>

              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                <Link href="/account" className="block px-4 py-2 hover:bg-purple-100">My Account</Link>
                <Link href="/agents/leads" className="block px-4 py-2 hover:bg-purple-100">Leads</Link>
                <Link href="/agents/calls" className="block px-4 py-2 hover:bg-purple-100">Calls</Link>
                <Link href="/agents/emails" className="block px-4 py-2 hover:bg-purple-100">Emails</Link>

              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="h-full flex flex-col justify-center items-center text-center relative z-10 px-6">
          <h2 className="uppercase tracking-widest text-gray-400 mt-6">
            Say Goodbye to Call Centers
          </h2>
          <h1 className="text-5xl md:text-7xl font-bold">
            Meet Your Outreach Ai Agent
          </h1>
          <h2 className="uppercase tracking-widest text-gray-400 mt-6">
            Revolutionize Communication
          </h2>
          <TextGenerateEffect
            className="mt-6 text-3xl md:text-5xl font-bold"
            words="Free Calls. Smart Schedules. Powered by AI Agents."
          />
          <p className="mt-6 max-w-2xl text-gray-400 text-md md:text-lg">
            Say goodbye to endless scheduling and missed calls. Our intelligent AI agents handle everything — from booking your meetings to placing free calls on your behalf.
          </p>

          <Link href="/agents" className="mt-8">
            <MagicButton
              title="Try Our Agents"
              icon={<FaLocationArrow />}
              position="right"
            />
          </Link>
        </div>
      </section>
    </ClerkProvider>
  );
};

export default Hero;
