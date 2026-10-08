import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Zap, Sparkles } from 'lucide-react';

interface CertItem {
  label: string;
  sublabel?: string;
  iconType: 'salesforce' | 'aws' | 'meta' | 'google' | 'security' | 'iso';
}

const CERTIFICATIONS: CertItem[] = [
  {
    label: 'Salesforce Certified',
    sublabel: 'Platform Developer & Administrator',
    iconType: 'salesforce',
  },
  {
    label: 'Salesforce AI Specialist',
    sublabel: 'Einstein & Agentforce Solutions',
    iconType: 'salesforce',
  },
  {
    label: 'AWS Solutions Architect',
    sublabel: 'Cloud Infrastructure & High Scalability',
    iconType: 'aws',
  },
  {
    label: 'Meta Cloud API Partner',
    sublabel: 'WhatsApp Business API Engineering',
    iconType: 'meta',
  },
  {
    label: 'Google Cloud Certified',
    sublabel: 'Enterprise AI & Data Sovereignty',
    iconType: 'google',
  },
  {
    label: 'SOC 2 & ISO 27001',
    sublabel: 'Bank-Grade Security Architecture',
    iconType: 'iso',
  },
];

export const CertificationBanner: React.FC = () => {
  // Duplicate array so scrolling left-to-right is seamless and continuous
  const items = [...CERTIFICATIONS, ...CERTIFICATIONS, ...CERTIFICATIONS, ...CERTIFICATIONS];

  return (
    <div className="relative w-full bg-neutral-900/60 backdrop-blur-xl text-white py-3.5 border-y border-neutral-700/50 shadow-md select-none z-20">
      {/* Translucent Edge Gradient Fades */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#F7F6F1]/80 via-[#F7F6F1]/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#F7F6F1]/80 via-[#F7F6F1]/40 to-transparent z-10 pointer-events-none" />

      {/* Marquee Container moving Left to Right */}
      <div className="flex w-max animate-marquee-ltr hover:[animation-play-state:paused]">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 px-8 text-left border-r border-neutral-700/40 group transition-colors hover:bg-neutral-800/50 py-1"
          >
            {/* Custom Salesforce / Partner Logos without any background box */}
            {item.iconType === 'salesforce' ? (
              <CloudSalesforceIcon className="w-5 h-5 text-[#00A1E0] shrink-0 group-hover:scale-110 transition-transform drop-shadow-sm" />
            ) : item.iconType === 'aws' ? (
              <Zap className="w-5 h-5 text-amber-400 shrink-0 group-hover:scale-110 transition-transform drop-shadow-sm" />
            ) : item.iconType === 'meta' ? (
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform drop-shadow-sm" />
            ) : item.iconType === 'google' ? (
              <Award className="w-5 h-5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform drop-shadow-sm" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-purple-300 shrink-0 group-hover:scale-110 transition-transform drop-shadow-sm" />
            )}

            {/* Label and Sublabel */}
            <div className="flex flex-col whitespace-nowrap">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold tracking-wide text-neutral-100 group-hover:text-amber-300 transition-colors">
                  {item.label}
                </span>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              {item.sublabel && (
                <span className="text-[10px] text-neutral-400 font-medium tracking-tight">
                  {item.sublabel}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Clean SVG Cloud Icon for Salesforce Certification
function CloudSalesforceIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-current`} viewBox="0 0 24 24">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
  );
}
