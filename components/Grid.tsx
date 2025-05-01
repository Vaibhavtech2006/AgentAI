"use client";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "@/data";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { HoverEffect } from "./ui/card-hover-effect";
import { CardDemo } from "./ui/Feature Block Animated Card";
import Typewriter from "typewriter-effect";

const hoverItems = [
  {
    title: "Lead Generation AI Agent",
    description:
      "AI-driven lead generation agent automating prospect identification and engagement.",
    link: "/sales/lead-generation",
  },
  {
    title: "AI Cold Emailing Agent",
    description:
      "AI-powered cold emailing agent autonomously researches prospects, crafts personalized messages, and sends targeted outreach emails to maximize engagement.",
    link: "/sales/email-assistant",
  },
  {
    title: "AI Voice Calling Agent",
    description:
      "AI-powered voice calling agent autonomously initiates calls and conducts natural conversations to resolve queries and qualify leads.",
    link: "/sales/crm-integration",
  },
  {
    title: "Conversational AI Agent",
    description:
      "Deploy 24/7 AI agents that chat with prospects, answer FAQs, and qualify leads in real-time.",
    link: "/sales/chat-agent",
  },
  {
    title: "Sales Forecasting",
    description:
      "Use predictive analytics to forecast revenue, identify risks, and make data-backed decisions.",
    link: "/sales/forecasting",
  },
  {
    title: "Deal Closing Assistant",
    description:
      "Let AI suggest optimal offers, follow-up timings, and persuasive content to close deals faster.",
    link: "/sales/closing-agent",
  },
];

const HomePage = () => {
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
    }, 3000); // show typing after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* 🚀 Hero Section with Image and Typing Effect */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        {!showTyping ? (
          <>
            <img
              src="/images/callcenter.jpg" // <-- Put your actual path here
              alt="Call Center Girl"
              className="w-full h-full object-cover opacity-80 transition-opacity duration-1000"
            />
            <div className="absolute bottom-10 text-white text-2xl font-semibold">
              Replacing Conventional Call Centers...
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-5xl font-bold text-indigo-500 mb-4">
              <Typewriter
                options={{
                  strings: ["vikriti.ai"],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
              />
            </h1>
            <p className="text-xl text-gray-300">Your AI-Powered Call Center Solution</p>
          </div>
        )}
      </section>

      {/* 🧩 Bento Grid Section */}
      <section id="about">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-bold text-white">
                Explore Our Features
              </h1>
              <p className="text-sm text-gray-300 mt-2">
                Each one crafted with precision & purpose.
              </p>
            </>
          }
        >
          <BentoGrid>
            {gridItems.map(
              ({
                id,
                title,
                description,
                className,
                img,
                imgClassName,
                titleClassName,
                spareImg,
              }) => (
                <BentoGridItem
                  key={id}
                  id={id}
                  title={title}
                  description={description}
                  className={className}
                  img={img}
                  imgClassName={imgClassName}
                  titleClassName={titleClassName}
                  spareImg={spareImg}
                />
              )
            )}
          </BentoGrid>
        </ContainerScroll>
      </section>

      {/* ✨ HoverEffect Cards Section */}
      <section className="mt-20 px-4">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Supercharge Your Sales with AI Agents
        </h2>
        <p className="text-center text-gray-300 max-w-2xl mx-auto mb-10">
          Explore powerful AI-driven tools designed to automate lead generation,
          personalize outreach, and optimize your entire sales pipeline.
        </p>
        <HoverEffect items={hoverItems} />
      </section>

      {/* 🌟 Feature Card Section */}
      <section className="mt-20 px-4 mb-10">
        <div className="card-container">
          <CardDemo />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
