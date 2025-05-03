'use client';

import React, { useEffect, useState } from 'react';
import { BentoGrid, BentoGridItem } from './ui/BentoGrid';
import { gridItems } from '@/data';
import { ContainerScroll } from '../components/ui/container-scroll-animation';
import { HoverEffect } from './ui/card-hover-effect';
import { CardDemo } from './ui/Feature Block Animated Card';
import Typewriter from 'typewriter-effect';
import { useKeenSlider } from 'keen-slider/react';
import Image from 'next/image';
import 'keen-slider/keen-slider.min.css';

interface TeamMember {
  name: string;
  role: string;
  img: string;
}

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

const teamMembers: TeamMember[] = [
  {
    name: 'Nipun Pal',
    role: 'Frontend Developer',
    img: '/images/nipun.jpg',
  },
  {
    name: 'Mrigaank Sharma',
    role: 'AI Engineer',
    img: '/images/jane.jpg',
  },
  {
    name: 'Vaibhav Khandelwal',
    role: 'Backend Developer',
    img: '/images/john.jpg',
  },
  {
    name: 'Kunal kushwaha',
    role: 'UI/UX Designer',
    img: '/images/alex.jpg',
  },
];

const HomePage: React.FC = () => {
  const [showTyping, setShowTyping] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    loop: true,
    slides: { perView: 1 },
    mode: 'free-snap',
    drag: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTyping(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Autoplay
  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, 3000);
    return () => clearInterval(interval);
  }, [instanceRef]);

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
            strings: ['vikriti.ai'],
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
          title: "Fast AI Calls",
          description: "AI-powered agents that respond in milliseconds.",
          img: "/images/ai-call.png",
        },
        {
          id: 2,
          title: "Real Leads",
          description: "Track and convert real-time leads automatically.",
          img: "/images/leads.png",
        },
        {
          id: 3,
          title: "Cold Emailing Ai",
          description: "AI agents that send personalized emails.",
          img: "/images/email.png",
        }
        // Add more features here
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

      

      {/* 👥 Team Slider Section with Arrows & Dots */}
      <section className="px-6 py-16 bg-[#0e1126] text-white text-center">
        <h2 className="text-4xl font-bold mb-8">Meet Our Team</h2>
        <div className="relative max-w-md mx-auto">
          <div ref={sliderRef} className="keen-slider">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="keen-slider__slide bg-[#1c223a] p-6 rounded-2xl shadow-lg"
              >
                <Image
                  src={member.img}
                  alt={member.name}
                  width={120}
                  height={120}
                  className="rounded-full mx-auto mb-4 border-4 border-indigo-500 object-cover"
                />
                <h3 className="text-2xl font-semibold">{member.name}</h3>
                <p className="text-indigo-400">{member.role}</p>
              </div>
            ))}
          </div>

          {/* Arrows */}
          <button
            onClick={() => instanceRef.current?.prev()}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-full shadow"
          >
            ‹
          </button>
          <button
            onClick={() => instanceRef.current?.next()}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded-full shadow"
          >
            ›
          </button>

          {/* Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {teamMembers.map((_, idx) => (
              <button
                key={idx}
                onClick={() => instanceRef.current?.moveToIdx(idx)}
                className={`w-3 h-3 rounded-full ${
                  currentSlide === idx
                    ? 'bg-indigo-500'
                    : 'bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
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
