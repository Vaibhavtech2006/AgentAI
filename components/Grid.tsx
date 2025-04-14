"use client";
import React from "react";
// ✅ import your Lamp section
import { BentoGrid, BentoGridItem } from "./ui/BentoGrid";
import { gridItems } from "@/data";
import { ContainerScroll } from "../components/ui/container-scroll-animation";
import { HoverEffect } from "./ui/card-hover-effect";
import { CardDemo } from "./ui/Feature Block Animated Card";

const hoverItems = [
  {
    title: "Lead Generation Bot",
    description:
      "Automate the discovery of high-quality leads using intelligent web scraping and GPT-powered outreach.",
    link: "/sales/lead-generation",
  },
  {
    title: "AI Email Assistant",
    description:
      "Craft personalized sales emails at scale with AI that adapts to tone, industry, and buyer persona.",
    link: "/sales/email-assistant",
  },
  {
    title: "Smart CRM Integration",
    description:
      "Seamlessly integrate AI into your CRM to prioritize deals, analyze patterns, and boost conversions.",
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
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* 🚀 Hero Section with Lamp Effect */}
      

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
