import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Compass, PenTool, Cpu, Rocket } from 'lucide-react';
import { sound } from '../utils/audio';

interface MilestoneStep {
  step: string;
  title: string;
  badge: string;
  duration: string;
  description: string;
  deliverables: string[];
  icon: React.FC<{ className?: string }>;
}

const ROADMAP_STEPS: MilestoneStep[] = [
  {
    step: '01',
    title: 'Discovery & Architecture Scope',
    badge: 'Checkpoint 1 · Phase 1',
    duration: 'Week 1',
    description: 'We define your project goals, target audience, technical architecture, and exact milestones on day one. No ambiguities.',
    deliverables: ['System Architecture Specification', 'Technical Milestone Roadmap', 'Fixed Scope & Delivery Guarantee'],
    icon: Compass,
  },
  {
    step: '02',
    title: 'Bespoke Web & Spatial Design',
    badge: 'Checkpoint 2 · Phase 2',
    duration: 'Week 2',
    description: 'Clean responsive layouts, mobile-first performance, and sub-second page loading speeds engineered for conversions.',
    deliverables: ['High-Converting Spatial UX', 'Sub-0.8s Core Web Vitals', 'Tailored Typography & Interactions'],
    icon: PenTool,
  },
  {
    step: '03',
    title: 'AI & Automation Sync',
    badge: 'Checkpoint 3 · Phase 3',
    duration: 'Week 3',
    description: 'Connect official Meta Cloud WhatsApp bots, automated notification flows, and customer CRM lead capture pipelines.',
    deliverables: ['Official Meta Cloud API WhatsApp', 'Private Business AI Pipelines', 'Automated Lead & CRM Triage'],
    icon: Cpu,
  },
  {
    step: '04',
    title: 'Production Launch & Handover',
    badge: 'Checkpoint 4 · Destination',
    duration: 'Week 4',
    description: 'End-to-end security audits, full data handover, zero-downtime DNS deployment, and ongoing dedicated technical maintenance.',
    deliverables: ['Full Source Code Handover', 'TLS 1.3 / Security Hardening', 'Dedicated Post-Launch SLA & Support'],
    icon: Rocket,
  },
];

// Custom Map Pin matching the user's reference image
const RoadMapPin: React.FC<{ active?: boolean; number: string; onClick?: () => void }> = ({
  active = false,
  number,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center cursor-pointer transition-transform duration-300 select-none ${
        active ? 'scale-115 -translate-y-1' : 'hover:scale-108 hover:-translate-y-0.5'
      }`}
    >
      {/* SVG Map Pin with outer coral-red ring and hollow white circular center */}
      <svg
        width="46"
        height="60"
        viewBox="0 0 46 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-md transition-all duration-300"
      >
        {/* Outer Coral Red Teardrop Pin */}
        <path
          d="M23 2C11.402 2 2 11.402 2 23C2 35.5 18 53.5 23 58C28 53.5 44 35.5 44 23C44 11.402 34.598 2 23 2Z"
          fill="#EF4444"
          className="transition-colors duration-300"
        />
        {/* Hollow White Circular Center */}
        <circle cx="23" cy="23" r="12" fill="#FFFFFF" />
      </svg>

      {/* Step Number inside circular pin center */}
      <span className="absolute top-[14px] font-mono font-black text-xs text-neutral-900 pointer-events-none">
        {number}
      </span>

      {/* Subtle pulsing ground shadow when active */}
      <span
        className={`w-4 h-1.5 rounded-full bg-neutral-900/20 blur-[1px] transition-opacity duration-300 mt-0.5 ${
          active ? 'opacity-80 scale-125' : 'opacity-40'
        }`}
      />
    </div>
  );
};

export const ArchitectureMatrix: React.FC<{ onBookServiceWithTopic: (topic: string) => void }> = ({
  onBookServiceWithTopic,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleStepClick = (index: number) => {
    sound.playClick();
    setActiveStep(index);
  };

  return (
    <section id="approach" className="relative py-14 sm:py-20 border-b border-neutral-300/60 overflow-hidden reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
            <span>Structured 4-Week Delivery</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            How We Turn Ideas Into <span className="text-highlight">Working Systems</span>.
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Follow the winding milestone roadmap below. Each checkpoint guarantees transparent sprint deliverables, direct engineer contact, and rapid turnaround.
          </p>
        </div>

        {/* =========================================================================
            WINDING S-CURVE DOTTED ROADMAP WITH CHECKPOINT PINS
            ========================================================================= */}
        <div className="relative py-4">
          
          {/* Desktop Curved S-Line Roadmap Track SVG */}
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-0">
            <svg
              className="w-full h-full"
              viewBox="0 0 1000 820"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Elegant Curving S-Path Dotted Track connecting all 4 Checkpoints */}
              <path
                d="M 120 70 C 500 70, 500 270, 880 270 C 500 270, 500 490, 120 490 C 500 490, 500 710, 880 710"
                stroke="#18181B"
                strokeWidth="3.5"
                strokeDasharray="4 12"
                strokeLinecap="round"
                className="opacity-75"
              />
            </svg>
          </div>

          {/* Mobile Vertical Dotted Track Line */}
          <div className="lg:hidden absolute left-[31px] top-8 bottom-8 w-[2px] border-l-2 border-dashed border-neutral-800/70 z-0" />

          {/* Road Map Checkpoints List (Alternating Left & Right along S-Curve) */}
          <div className="space-y-12 lg:space-y-14 relative z-10">
            {ROADMAP_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              const isEven = idx % 2 === 1; // Alternates left/right on desktop

              return (
                <div
                  key={step.step}
                  onClick={() => handleStepClick(idx)}
                  className={`flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10 transition-all duration-300 cursor-pointer ${
                    isEven ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  {/* Map Pin Marker Container */}
                  <div className="flex items-center gap-4 lg:w-[140px] shrink-0 justify-start lg:justify-center">
                    <RoadMapPin
                      number={step.step}
                      active={isActive}
                      onClick={() => handleStepClick(idx)}
                    />

                    {/* Step duration pill visible on mobile */}
                    <span className="lg:hidden px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-amber-400/20 text-amber-900 border border-amber-400/30">
                      {step.duration}
                    </span>
                  </div>

                  {/* Checkpoint Content Card */}
                  <div
                    className={`flex-1 w-full neo-card p-6 sm:p-8 text-left transition-all duration-300 border ${
                      isActive
                        ? 'border-amber-400 shadow-xl bg-[#FAF8F2] scale-[1.01]'
                        : 'border-white/85 hover:border-amber-200 hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${isActive ? 'bg-amber-400 text-neutral-950' : 'neo-box text-amber-700'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 block">
                            {step.badge}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <span className="hidden lg:inline-block px-3 py-1 rounded-lg text-xs font-mono font-bold bg-amber-400/25 text-amber-900 border border-amber-400/30 self-start sm:self-auto">
                        {step.duration}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium mb-4">
                      {step.description}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="pt-3 border-t border-neutral-300/40 space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 block">
                        Guaranteed Checkpoint Deliverables:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {step.deliverables.map((item, dIdx) => (
                          <div
                            key={dIdx}
                            className="flex items-start gap-1.5 text-xs text-neutral-800 bg-white/70 p-2 rounded-lg border border-white font-medium"
                          >
                            <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isActive ? 'text-amber-600' : 'text-emerald-600'}`} />
                            <span className="leading-tight">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Consultation Callout Card */}
        <div className="neo-card p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left border border-white/90">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Clear & Predictable Milestones
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Ready to start your roadmap with zero guesswork?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every deliverable is mapped out on our milestone roadmap before kickoff. Weekly live sprint demos and direct engineer communication.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onBookServiceWithTopic('General Project Consultation');
            }}
            className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider clay-btn-yellow rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Schedule Roadmap Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
