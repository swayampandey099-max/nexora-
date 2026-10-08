import React from 'react';
import { ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

export const ArchitectureMatrix: React.FC<{ onBookServiceWithTopic: (topic: string) => void }> = ({
  onBookServiceWithTopic,
}) => {
  return (
    <section id="approach" className="relative py-10 sm:py-14 border-b border-neutral-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>Workflow & Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            How We Turn Ideas Into <span className="text-highlight">Working Systems</span>.
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            No endless meetings, no technical confusion. A straightforward 4-step workflow from initial
            consultation to live production launch.
          </p>
        </div>

        {/* 4 Steps Grid (Neomorphic Raised Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          <div className="neo-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl neo-box flex items-center justify-center text-neutral-900 font-black text-sm font-mono">
              01
            </div>
            <h3 className="text-base font-bold text-neutral-900">1. Discovery & Scope</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We define your project goals, target audience, technical architecture, and exact milestones on day one.
            </p>
          </div>

          <div className="neo-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl neo-box flex items-center justify-center text-neutral-900 font-black text-sm font-mono">
              02
            </div>
            <h3 className="text-base font-bold text-neutral-900">2. Custom Web Design</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clean responsive layouts, mobile-first performance, and sub-second page loading speeds.
            </p>
          </div>

          <div className="neo-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl neo-box flex items-center justify-center text-neutral-900 font-black text-sm font-mono">
              03
            </div>
            <h3 className="text-base font-bold text-neutral-900">3. AI & Automation Sync</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Connect official WhatsApp bots, automated notification flows, and customer CRM pipelines.
            </p>
          </div>

          <div className="neo-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl neo-box flex items-center justify-center text-neutral-900 font-black text-sm font-mono">
              04
            </div>
            <h3 className="text-base font-bold text-neutral-900">4. Launch & Support</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              End-to-end security audits, full data handover, and ongoing dedicated technical maintenance.
            </p>
          </div>
        </div>

        {/* Consultation Card (Neomorphic Box + Claymorphic Button) */}
        <div className="neo-card p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Clear & Predictable Milestones
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900">
              Ready to start your project with zero guesswork?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Every deliverable is defined in writing before kickoff. Fixed milestones, weekly demos, and
              direct communication with our senior engineers.
            </p>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onBookServiceWithTopic('General Project Consultation');
            }}
            className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider clay-btn-yellow rounded-xl flex items-center gap-2 cursor-pointer shrink-0"
          >
            <span>Schedule Project Call</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
