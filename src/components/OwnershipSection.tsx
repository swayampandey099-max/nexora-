import React from 'react';
import ownerPfp from '../assets/images/owner_pfp.webp';
import { sound } from '../utils/audio';
import { Instagram, Shield } from 'lucide-react';

interface OwnerMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  instagram?: {
    handle: string;
    url: string;
  };
}

interface OwnershipSectionProps {
  onOpenAdminPortal?: () => void;
}

const OWNERS: OwnerMember[] = [
  {
    id: 'swayam-pandey',
    name: 'Swayam Pandey',
    role: 'Founder & Lead Systems Architect',
    bio: 'Lead architect behind Nexora’s web engineering and custom AI integrations.',
    instagram: {
      handle: 'swyam.py',
      url: 'https://instagram.com/swyam.py',
    },
  },
  {
    id: 'ansh-shukla',
    name: 'Ansh Shukla',
    role: 'Co-Founder & Operations Lead',
    bio: 'Oversees studio operations, project delivery management, and client execution.',
  },
  {
    id: 'r-narayan-shukla',
    name: 'R. Narayan Shukla',
    role: 'Co-Founder & Technology Director',
    bio: 'Directs cloud infrastructure, system security standards, and enterprise architecture.',
  },
];

export const OwnershipSection: React.FC<OwnershipSectionProps> = ({ onOpenAdminPortal }) => {
  return (
    <section id="ownership" className="relative py-12 sm:py-16 border-b border-neutral-300/60 overflow-hidden reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
              <span>Studio Leadership</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
              Agency <span className="text-highlight">Ownership</span>.
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Direct leadership by the studio founders. Transparent, accountable, and focused on pure engineering craft.
            </p>
          </div>

          {onOpenAdminPortal && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenAdminPortal();
              }}
              className="self-start sm:self-auto px-3.5 py-2 rounded-xl neo-box text-xs font-mono font-bold text-neutral-800 hover:text-amber-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs border border-white/80"
              title="Launch Executive Command Portal"
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>Executive Admin Portal</span>
            </button>
          )}
        </div>

        {/* Floating Side-by-Side Owners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {OWNERS.map((owner, idx) => {
            return (
              <div
                key={owner.id}
                onMouseEnter={() => sound.playHover()}
                className="neo-card p-6 sm:p-8 flex flex-col justify-between text-left space-y-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group border border-white/80"
              >
                {/* Floating ambient subtle glow */}
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-amber-200/20 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-300/30 transition-colors" />

                <div className="space-y-4 relative z-10">
                  {/* Circular Profile Picture - Strict Circular Form, No Logo */}
                  <div className="flex items-center justify-between">
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden p-1 bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 shadow-md">
                        <img
                          src={ownerPfp}
                          alt={owner.name}
                          loading="eager"
                          className="w-full h-full object-cover rounded-full bg-[#EAE8E1]"
                        />
                      </div>
                      <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </div>
                    </div>

                    <div className="neo-box px-3 py-1 rounded-xl text-neutral-800 text-[11px] font-mono font-bold">
                      0{idx + 1}
                    </div>
                  </div>

                  {/* Name and Role */}
                  <div className="space-y-1 pt-1">
                    <h3 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                      {owner.name}
                    </h3>
                    <p className="text-xs font-bold text-amber-900 leading-snug">
                      {owner.role}
                    </p>
                  </div>

                  {/* Grounded Bio (No fake promises) */}
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {owner.bio}
                  </p>
                </div>

                {/* Bottom Bar: Instagram Handle for Swayam */}
                <div className="pt-4 border-t border-neutral-300/40 flex items-center justify-between text-xs relative z-10">
                  {owner.instagram ? (
                    <a
                      href={owner.instagram.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 font-bold transition-all text-xs"
                    >
                      <Instagram className="w-3.5 h-3.5 text-pink-600" />
                      <span>@{owner.instagram.handle}</span>
                    </a>
                  ) : (
                    <span className="text-[11px] font-medium text-neutral-500">
                      Co-Founder
                    </span>
                  )}

                  <span className="text-[11px] font-mono text-neutral-400">
                    Nexora Studio
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
