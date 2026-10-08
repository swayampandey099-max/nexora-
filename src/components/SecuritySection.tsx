import React from 'react';
import { Lock, ShieldCheck, Key, FileText, CheckCircle2 } from 'lucide-react';

export const SecuritySection: React.FC = () => {
  const safetyGuarantees = [
    {
      icon: Lock,
      title: 'End-to-End Encryption',
      description: 'All customer data, contact records, and backend payloads use industry-standard TLS 1.3 in transit and AES-256 at rest.',
    },
    {
      icon: Key,
      title: 'Complete Data Sovereignty',
      description: 'Your proprietary company data, client lists, and custom LLM weights belong exclusively to you. Zero telemetry and zero public model training.',
    },
    {
      icon: ShieldCheck,
      title: 'Security Audits & Penetration Testing',
      description: 'We run scheduled vulnerability assessments, dependency audits, and strict input sanitization before deploying to production.',
    },
    {
      icon: FileText,
      title: 'Mutual Non-Disclosure (NDA)',
      description: 'Every project begins with a legally binding confidentiality agreement to ensure your trade secrets and systems remain 100% protected.',
    },
  ];

  return (
    <section id="security" className="relative py-10 sm:py-14 border-b border-neutral-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl space-y-4 mb-8 sm:mb-10 text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            <span>Security & Governance</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            How We Protect Your <span className="text-highlight">Business Data</span>.
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Enterprise-grade security practices built into every line of code. We protect your intellectual
            property, user records, and private AI models from day one.
          </p>
        </div>

        {/* 4 Guarantees in Neomorphic Raised Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {safetyGuarantees.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl neo-card space-y-3 text-left"
              >
                <div className="w-10 h-10 rounded-xl neo-box flex items-center justify-center text-amber-700">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* Enterprise Compliance Summary Card */}
        <div className="neo-card p-6 sm:p-8 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-neutral-900">
              Strict Adherence to International Privacy Standards
            </h4>
            <p className="text-xs sm:text-sm text-neutral-600">
              Designed for GDPR, HIPAA, and CCPA readiness. Hosted in isolated VPC environments with automated audit trails.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-700">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>TLS 1.3 Certified</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AES-256 Storage</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Public AI Leaks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
