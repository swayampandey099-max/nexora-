import React from 'react';
import { Mail, ArrowUp, Shield, Instagram } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  isOwner?: boolean;
  onOpenOwnerPortal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ isOwner, onOpenOwnerPortal }) => {
  const scrollToTop = () => {
    sound.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-neutral-300/60 py-10 text-neutral-600 text-left bg-[#F7F6F1]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-neutral-300/60">
          {/* Col 1: Wordmark & Statement */}
          <div className="md:col-span-2 space-y-4">
            <div className="text-2xl font-black tracking-tight text-neutral-900">
              Nexora
            </div>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-sm leading-relaxed">
              Boutique digital engineering studio specializing in high-converting web apps,
              e-commerce architecture, and private business AI workflows.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href="mailto:admin@nexora.digital"
                className="inline-flex items-center gap-2 px-4 py-2.5 btn-secondary text-xs font-bold text-neutral-900 hover:text-amber-800"
              >
                <Mail className="w-3.5 h-3.5 text-amber-600" />
                <span>admin@nexora.digital</span>
              </a>
              <a
                href="https://instagram.com/nexora.sii_"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 btn-secondary text-xs font-bold text-neutral-900 hover:text-pink-700"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>@nexora.sii_</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">Capabilities</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li>
                <a href="#services" className="hover:text-neutral-900 transition-colors">
                  Web & E-Commerce
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-neutral-900 transition-colors">
                  Meta Cloud WhatsApp
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-neutral-900 transition-colors">
                  Private Enterprise AI
                </a>
              </li>
              <li>
                <a href="#approach" className="hover:text-neutral-900 transition-colors">
                  4-Step Methodology
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiry */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800">Direct Inquiries</h4>
            <ul className="space-y-2 text-xs text-neutral-600 font-medium">
              <li>
                <a href="#book" className="hover:text-neutral-900 transition-colors">
                  Schedule Discovery Call
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-neutral-900 transition-colors">
                  Security & Data Privacy
                </a>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-neutral-900 transition-colors">
                  Client Outcomes
                </a>
              </li>
              <li>
                <a
                  href="mailto:admin@nexora.digital?subject=Nexora%20Project%20Inquiry"
                  className="hover:text-neutral-900 transition-colors"
                >
                  Direct Email Outreach
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/nexora.sii_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <Instagram className="w-3 h-3 text-pink-600" />
                  <span>Instagram: @nexora.sii_</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <p>© 2026 Nexora Agency. All rights reserved.</p>

          <div className="flex items-center gap-3">
            {isOwner && onOpenOwnerPortal && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenOwnerPortal();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-neutral-600 hover:text-amber-700 bg-neutral-200/50 hover:bg-neutral-200 transition-colors cursor-pointer text-xs font-semibold"
              >
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Executive Owner Portal</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-4 py-2 btn-secondary text-neutral-800 hover:text-neutral-950 transition-colors cursor-pointer font-bold"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
