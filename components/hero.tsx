import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { cn } from "@/utils/cn";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa";
import {ClerkProvider} from "@clerk/nextjs"
import { FollowerPointerCard } from "../components/ui/following-pointer";
import ColourfulText from "@/components/ui/colourful-text"
import { motion } from "motion/react"


const Hero = () => {
  return (
    <ClerkProvider>
    <FollowerPointerCard >
    <section className="relative pb-20 pt-36 overflow-hidden">
      
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

      {/* Main Heading */}
      <div className="relative z-10">
  <h1 className="text-center text-black dark:text-white">
    <div className="text-6xl md:text-8xl lg:text-5xl font-bold">
      <ColourfulText text="Vikriti.Ai" />
    </div>
    <div className="text-4xl font-bold mt-2">
      Meet Your Personal AI Agents
    </div>
  </h1>
</div>

      {/* Background Effects */}
      <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-black absolute top-0 left-0">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      </div>

      {/* Content Section */}
      <div className="flex justify-center relative my-20 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest max-w-80 text-gray-700 dark:text-gray-300">
            Revolutionize Communication
          </h2>
          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl font-bold text-black dark:text-white"
            words="Free Calls. Smart Schedules. Powered by AI Agents."
          />
          <p className="text-center text-gray-600 dark:text-gray-400 mt-4 md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Say goodbye to endless scheduling and missed calls. Our intelligent AI agents handle everything — from booking your meetings to placing free calls on your behalf.
          </p>

          <a href="#about">
            <MagicButton
              title="Try Our Agents"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
      
    </section>
    </FollowerPointerCard>
    </ClerkProvider>
  );
};

export default Hero;
