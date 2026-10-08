import React from 'react';
import { ArrowDown, ArrowRight, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';
import heroImg from '../assets/images/hero_nexora_spatial_opt.webp';

interface HeroProps {
  onBookClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick }) => {
  return (
    <section className="relative flex items-center pt-8 sm:pt-12 pb-10 sm:pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-7 text-left">
            {/* Clean Unboxed Eyebrow */}
            <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
              <span>Digital Architecture & Applied AI</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-neutral-900 leading-[1.12] text-balance">
              We engineer high-converting websites and{' '}
              <span className="text-highlight">
                smart AI tools
              </span>{' '}
              for scaling businesses.
            </h1>

            {/* Value Statement */}
            <p className="text-base sm:text-lg text-neutral-600 max-w-xl leading-relaxed">
              From bespoke web design and custom e-commerce to automated WhatsApp sales bots and
              private business AI models—we build tools that accelerate your company's growth.
            </p>

            {/* Tactile Claymorphic Buttons (Rectangular with Soft Corners) */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  sound.playClick();
                  onBookClick();
                }}
                className="px-7 py-3.5 text-xs font-bold uppercase tracking-wider clay-btn-yellow rounded-xl cursor-pointer flex items-center gap-2"
              >
                <span>Book a Discovery Call</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#services"
                onClick={() => sound.playClick()}
                className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider clay-btn-neutral rounded-xl flex items-center gap-2"
              >
                <span>Explore 11 Services</span>
                <ArrowDown className="w-4 h-4 text-amber-600" />
              </a>
            </div>

            {/* Clean Metadata Line */}
            <div className="pt-6 border-t border-neutral-300/60 flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-medium text-neutral-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bespoke Engineering (Zero Templates)</span>
              </div>
              <span className="text-neutral-300 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sub-Second Response Latency</span>
              </div>
              <span className="text-neutral-300 hidden sm:inline">·</span>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Private Data Sovereignty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Neomorphic Studio Showcase Card (5 Cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="w-full max-w-md lg:max-w-none neo-card overflow-hidden">
              <div className="relative aspect-4/3 overflow-hidden bg-neutral-200">
                <img
                  src={heroImg}
                  alt="Nexora Design Studio"
                  loading="eager"
                  fetchPriority="high"
                  className="w-full h-full object-cover object-center filter contrast-105 hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white text-left">
                  <p className="text-xs uppercase tracking-wider font-semibold text-amber-300">
                    Featured Engagement
                  </p>
                  <p className="text-base font-bold text-white mt-0.5">
                    Automated E-Commerce & Private Intelligence Architecture
                  </p>
                </div>
              </div>

              <div className="p-6 text-left space-y-3 bg-[#F7F6F1]">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span>Average Time to Launch: <strong className="text-neutral-900">2 - 4 Weeks</strong></span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Now Booking
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Every system is tailored to your business operations. Fixed deliverables, weekly milestones,
                  and direct communication.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
