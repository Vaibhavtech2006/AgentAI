'use client';

import React, { useEffect, useState } from 'react';
import { BentoGrid, BentoGridItem } from './ui/BentoGrid';
import { gridItems } from '@/data';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import { HoverEffect } from './ui/card-hover-effect';
import { CardDemo } from './ui/Feature Block Animated Card';
import Typewriter from 'typewriter-effect';

const hoverItems = [
  {
    title: 'Lead Generation AI Agent',
    description:
      'AI-driven lead generation agent automating prospect identification and engagement.',
    link: '/sales/lead-generation',
  },
  {
    title: 'AI Cold Emailing Agent',
    description:
      'AI-powered cold emailing agent autonomously researches prospects, crafts personalized messages, and sends targeted outreach emails to maximize engagement.',
    link: '/sales/email-assistant',
  },
  {
    title: 'AI Voice Calling Agent',
    description:
      'AI-powered voice calling agent autonomously initiates calls and conducts natural conversations to resolve queries and qualify leads.',
    link: '/sales/crm-integration',
  },
  {
    title: 'Conversational AI Agent',
    description:
      'Deploy 24/7 AI agents that chat with prospects, answer FAQs, and qualify leads in real-time.',
    link: '/sales/chat-agent',
  },
  {
    title: 'Sales Forecasting',
    description:
      'Use predictive analytics to forecast revenue, identify risks, and make data-backed decisions.',
    link: '/sales/forecasting',
  },
  {
    title: 'Deal Closing Assistant',
    description:
      'Let AI suggest optimal offers, follow-up timings, and persuasive content to close deals faster.',
    link: '/sales/closing-agent',
  },
];

const HomePage: React.FC = () => {
  const [showTyping, setShowTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* 🚀 Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden">
        <style jsx>{`
          @keyframes smoothSlideInLeft {
            0% {
              transform: translateX(-100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes smoothSlideInRight {
            0% {
              transform: translateX(100%);
              opacity: 0;
            }
            100% {
              transform: translateX(0);
              opacity: 1;
            }
          }

          .smooth-left {
            animation: smoothSlideInLeft 1.2s ease-out forwards;
          }

          .smooth-right {
            animation: smoothSlideInRight 1.2s ease-out forwards;
          }
        `}</style>

        {!showTyping ? (
          <>
            <img
              src="/images/callcenter.jpg"
              alt="Call Center Girl"
              className="w-100 h-100 object-cover border-4 border-indigo-500 rounded-lg opacity-80 absolute left-0 smooth-left"
            />
            <div className="absolute bottom-40 right-10 text-white text-4xl bg-indigo-500 p-4 rounded-lg font-semibold smooth-right">
              Replacing Conventional Call Centers...
            </div>
          </>
        ) : (
          <div className="text-center">
            <h1 className="text-7xl font-bold text-indigo-500 mb-4">
              <Typewriter
                options={{
                  strings: ['Vikriti.Ai'],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
              />
            </h1>
            <p className="text-xl text-gray-300">
              with our AI-Powered Call Center Solution
            </p>
          </div>
        )}
      </section>

      {/* 🧩 Bento Grid Section */}
      <section id="about">
        <ContainerScroll
          titleComponent={
            <>
              <h1 className="text-4xl font-bold text-white">Explore Our Features</h1>
              <p className="text-sm text-gray-300 mt-2">
                Each one crafted with precision & purpose.
              </p>
            </>
          }
        >
          <BentoGrid>
            {[
              {
                id: 1,
                title: 'Fast AI Calls',
                description: 'AI-powered agents that respond in milliseconds.',
                img: '/images/ai-call.jpg',
              },
              {
                id: 2,
                title: 'Real Leads',
                description: 'Track and convert real-time leads automatically.',
                img: '/images/leads.jpg',
              },
              {
                id: 3,
                title: 'Cold Emailing Ai',
                description: 'AI agents that send personalized emails.',
                img: '/images/email.png',
              },
            ].map(({ id, title, description, img }) => (
              <BentoGridItem
                key={id}
                title={title}
                description={description}
                img={img}
              />
            ))}
          </BentoGrid>
        </ContainerScroll>
      </section>

      {/* ✨ Hover Cards Section */}
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
