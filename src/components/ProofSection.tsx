import React from 'react';
import { sound } from '../utils/audio';

interface CaseStudy {
  client: string;
  industry: string;
  metric: string;
  metricLabel: string;
  story: string;
  deliverable: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    client: 'Vanguard Retail',
    industry: 'High-End Consumer Products',
    metric: '+310%',
    metricLabel: 'Increase in Store Conversions',
    story: 'Replaced a slow, cluttered storefront with a bespoke mobile-first digital experience and one-click checkout.',
    deliverable: 'Custom Web Storefront & Headless Checkout',
  },
  {
    client: 'OmniFlow Logistics',
    industry: 'Regional Distribution & Services',
    metric: '1,400+ hrs',
    metricLabel: 'Annual Support Hours Saved',
    story: 'Automated 80% of routine shipment status queries and instant quote estimates using the official WhatsApp Meta Cloud API.',
    deliverable: 'Meta Cloud API WhatsApp & CRM Flow',
  },
  {
    client: 'Aegis Advisory',
    industry: 'Financial & Legal Consulting',
    metric: '100%',
    metricLabel: 'Confidential Knowledge Model',
    story: 'Trained an on-premise AI model to query thousands of internal policy memos without ever exposing client data to public LLMs.',
    deliverable: 'Fine-Tuned Private Business LLM & RAG',
  },
];

export const ProofSection: React.FC = () => {
  return (
    <section id="case-studies" className="relative py-10 sm:py-14 border-b border-neutral-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-8 sm:mb-10 text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>Client Outcomes</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            Real Work, Measurable <span className="text-highlight">Outcomes</span>.
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            See how scaling companies partnered with Nexora to upscale their digital presence,
            automate repetitive communications, and protect sensitive data.
          </p>
        </div>

        {/* 3 Case Study Cards in Neomorphic Raised Surfaces */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study, idx) => (
            <div
              key={idx}
              onMouseEnter={() => sound.playHover()}
              className="p-8 neo-card flex flex-col justify-between space-y-6 text-left"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-neutral-500">
                  <span className="font-bold text-neutral-900 neo-box px-3 py-1 rounded-lg">
                    {study.client}
                  </span>
                  <span>{study.industry}</span>
                </div>

                <div className="pt-2 pb-2">
                  <div className="text-4xl sm:text-5xl font-black text-neutral-900 tracking-tight">
                    {study.metric}
                  </div>
                  <p className="text-xs font-bold text-amber-800 mt-1">{study.metricLabel}</p>
                </div>

                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {study.story}
                </p>
              </div>

              <div className="pt-4 border-t border-neutral-300/40">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Delivered Architecture
                </span>
                <span className="text-xs font-bold text-neutral-900">
                  {study.deliverable}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
