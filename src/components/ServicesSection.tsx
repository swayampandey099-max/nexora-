import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Zap,
  Globe,
  MessageSquare,
  Bot,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { SERVICES_DATA } from '../data/services';
import { ServiceItem } from '../types';
import { sound } from '../utils/audio';

interface ServicesSectionProps {
  onInspectService: (service: ServiceItem) => void;
  onBookService: (service: ServiceItem) => void;
}

type CategoryFilter = 'all' | 'web' | 'whatsapp' | 'ai' | 'security';

// 11 Suitable Soft Pastel Colors for Claymorphism
interface SoftColorTheme {
  bg: string;
  border: string;
  tagBg: string;
  tagText: string;
  metricBg: string;
  metricText: string;
  btnBg: string;
}

const SOFT_COLOR_PALETTES: Record<number, SoftColorTheme> = {
  0: { // 01 Web Design: Soft Butter Honey
    bg: 'bg-[#FEF9C3]/90',
    border: 'border-[#FDE047]/70',
    tagBg: 'bg-[#FEF08A]/80',
    tagText: 'text-amber-900',
    metricBg: 'bg-amber-100',
    metricText: 'text-amber-950',
    btnBg: 'bg-amber-300 hover:bg-amber-400 text-neutral-900',
  },
  1: { // 02 E-Commerce: Soft Mint Pistachio
    bg: 'bg-[#ECFDF5]/90',
    border: 'border-[#A7F3D0]/70',
    tagBg: 'bg-[#D1FAE5]/80',
    tagText: 'text-emerald-900',
    metricBg: 'bg-emerald-100',
    metricText: 'text-emerald-950',
    btnBg: 'bg-emerald-300 hover:bg-emerald-400 text-neutral-900',
  },
  2: { // 03 SEO: Soft Sky Glacier
    bg: 'bg-[#EFF6FF]/90',
    border: 'border-[#BFDBFE]/70',
    tagBg: 'bg-[#DBEAFE]/80',
    tagText: 'text-blue-900',
    metricBg: 'bg-blue-100',
    metricText: 'text-blue-950',
    btnBg: 'bg-blue-300 hover:bg-blue-400 text-neutral-900',
  },
  3: { // 04 AI Automation: Soft Lavender Lilac
    bg: 'bg-[#F5F3FF]/90',
    border: 'border-[#DDD6FE]/70',
    tagBg: 'bg-[#EDE9FE]/80',
    tagText: 'text-purple-900',
    metricBg: 'bg-purple-100',
    metricText: 'text-purple-950',
    btnBg: 'bg-purple-300 hover:bg-purple-400 text-neutral-900',
  },
  4: { // 05 WhatsApp Meta: Soft Jade Green
    bg: 'bg-[#F0FDF4]/90',
    border: 'border-[#BBF7D0]/70',
    tagBg: 'bg-[#DCFCE7]/80',
    tagText: 'text-green-900',
    metricBg: 'bg-green-100',
    metricText: 'text-green-950',
    btnBg: 'bg-green-300 hover:bg-green-400 text-neutral-900',
  },
  5: { // 06 Lead Triage: Soft Peach Apricot
    bg: 'bg-[#FFF7ED]/90',
    border: 'border-[#FED7AA]/70',
    tagBg: 'bg-[#FFEDD5]/80',
    tagText: 'text-orange-900',
    metricBg: 'bg-orange-100',
    metricText: 'text-orange-950',
    btnBg: 'bg-orange-300 hover:bg-orange-400 text-neutral-900',
  },
  6: { // 07 Team Inboxes: Soft Cyan Aquamarine
    bg: 'bg-[#ECFEFF]/90',
    border: 'border-[#A5F3FC]/70',
    tagBg: 'bg-[#CFFAFE]/80',
    tagText: 'text-cyan-900',
    metricBg: 'bg-cyan-100',
    metricText: 'text-cyan-950',
    btnBg: 'bg-cyan-300 hover:bg-cyan-400 text-neutral-900',
  },
  7: { // 08 Chatbots: Soft Blush Coral
    bg: 'bg-[#FFF1F2]/90',
    border: 'border-[#FECDD3]/70',
    tagBg: 'bg-[#FFE4E6]/80',
    tagText: 'text-rose-900',
    metricBg: 'bg-rose-100',
    metricText: 'text-rose-950',
    btnBg: 'bg-rose-300 hover:bg-rose-400 text-neutral-900',
  },
  8: { // 09 Enterprise AI: Soft Indigo Periwinkle
    bg: 'bg-[#EEF2FF]/90',
    border: 'border-[#C7D2FE]/70',
    tagBg: 'bg-[#E0E7FF]/80',
    tagText: 'text-indigo-900',
    metricBg: 'bg-indigo-100',
    metricText: 'text-indigo-950',
    btnBg: 'bg-indigo-300 hover:bg-indigo-400 text-neutral-900',
  },
  9: { // 10 Fine-Tuned LLMs: Soft Vanilla Sun
    bg: 'bg-[#FEFCE8]/90',
    border: 'border-[#FEF08A]/70',
    tagBg: 'bg-[#FEF9C3]/80',
    tagText: 'text-yellow-900',
    metricBg: 'bg-yellow-100',
    metricText: 'text-yellow-950',
    btnBg: 'bg-yellow-300 hover:bg-yellow-400 text-neutral-900',
  },
  10: { // 11 Local AI: Soft Pearl Slate
    bg: 'bg-[#F8FAFC]/90',
    border: 'border-[#CBD5E1]/70',
    tagBg: 'bg-[#F1F5F9]/80',
    tagText: 'text-slate-800',
    metricBg: 'bg-slate-200/70',
    metricText: 'text-slate-900',
    btnBg: 'bg-slate-300 hover:bg-slate-400 text-neutral-900',
  },
};

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onInspectService,
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Category filter tabs definition
  const CATEGORY_TABS: { id: CategoryFilter; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All 11 Capabilities', icon: Layers },
    { id: 'web', label: 'Web & E-Commerce', icon: Globe },
    { id: 'whatsapp', label: 'Meta WhatsApp', icon: MessageSquare },
    { id: 'ai', label: 'Autonomous AI', icon: Bot },
    { id: 'security', label: 'Security & CRM', icon: ShieldCheck },
  ];

  // Filtered capabilities list based on tab & search input
  const filteredServices = useMemo(() => {
    return SERVICES_DATA.filter((service) => {
      // Category match
      let matchesCategory = true;
      if (selectedCategory === 'web') {
        matchesCategory = service.category === 'web' || service.id.includes('web') || service.id.includes('ecommerce');
      } else if (selectedCategory === 'whatsapp') {
        matchesCategory = service.category === 'whatsapp' || service.id.includes('whatsapp') || service.id.includes('messaging');
      } else if (selectedCategory === 'ai') {
        matchesCategory = service.category === 'ai' || service.id.includes('ai') || service.id.includes('agent');
      } else if (selectedCategory === 'security') {
        matchesCategory =
          (service.category as string) === 'security' ||
          service.category === 'enterprise' ||
          service.id.includes('salesforce') ||
          service.id.includes('security');
      }

      // Search match
      const query = searchQuery.toLowerCase().trim();
      let matchesSearch = true;
      if (query) {
        matchesSearch =
          service.title.toLowerCase().includes(query) ||
          service.tagline.toLowerCase().includes(query) ||
          service.description.toLowerCase().includes(query) ||
          service.deliverables.some((d) => d.toLowerCase().includes(query));
      }

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="services" className="relative py-12 sm:py-16 border-y border-neutral-300/60 overflow-hidden reveal-init">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
              <span>Full Service Spectrum (11 Capabilities)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
              Tactile <span className="text-highlight">Capabilities Matrix</span>.
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Explore all 11 production capabilities in our tactile claymorphic grid. Engineered with custom soft palettes, sub-second performance, and instant bookings.
            </p>
          </div>

          {/* Real-time Filter Search Input */}
          <div className="relative min-w-[260px] sm:min-w-[320px]">
            <div className="neo-inset flex items-center px-3.5 py-2.5 rounded-xl border border-neutral-300/80">
              <Search className="w-4 h-4 text-amber-600 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 11 capabilities..."
                className="w-full bg-transparent text-xs text-neutral-900 placeholder:text-neutral-500 focus:outline-none font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-neutral-400 hover:text-neutral-800 font-bold ml-1 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedCategory(tab.id);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'clay-btn-yellow scale-[1.02] shadow-md'
                    : 'neo-box text-neutral-700 hover:text-neutral-950 hover:bg-white/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-900' : 'text-amber-700'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 ? (
          <div className="clay-card p-10 text-center space-y-3 my-6 bg-white/70 border border-white">
            <Search className="w-8 h-8 text-amber-500 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No capabilities match "{searchQuery}"</h3>
            <p className="text-xs text-neutral-600 max-w-sm mx-auto">
              Try searching for "AI", "WhatsApp", "SEO", "E-Commerce", or reset your category filter.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-bold clay-btn-yellow rounded-xl cursor-pointer inline-block mt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* =========================================================================
             SQUARE CLAYMORPHISM GRID: ALL 11 CAPABILITIES
             ========================================================================= */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 text-left">
            {filteredServices.map((service, originalIdx) => {
              const paletteIdx = originalIdx % 11;
              const palette = SOFT_COLOR_PALETTES[paletteIdx] || SOFT_COLOR_PALETTES[0];

              return (
                <div
                  key={service.id}
                  onMouseEnter={() => sound.playHover()}
                  className={`clay-card p-6 flex flex-col justify-between border ${palette.bg} ${palette.border} aspect-square transition-all duration-300 relative group overflow-hidden select-none`}
                >
                  {/* Subtle top ambient specular shine */}
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none rounded-t-[28px]" />

                  {/* Top Bar: Number Badge + Category + Impact Metric */}
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      {/* Pillowy Clay Number Box */}
                      <span className="w-10 h-10 rounded-xl bg-white/90 shadow-sm border border-white flex items-center justify-center font-mono font-black text-xs text-neutral-900 shrink-0">
                        {service.number}
                      </span>

                      {/* Domain Category Chip */}
                      <span
                        className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg ${palette.tagBg} ${palette.tagText} border border-white/60 shadow-2xs`}
                      >
                        {service.category}
                      </span>
                    </div>

                    {/* Impact Metric Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/75 border border-white text-[11px] font-bold text-neutral-800 shadow-2xs">
                      <Zap className="w-3 h-3 text-amber-600 shrink-0" />
                      <span>{service.metrics}</span>
                    </div>
                  </div>

                  {/* Middle Content: Title + Tagline */}
                  <div className="space-y-2 relative z-10 my-auto py-2">
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight leading-snug group-hover:text-neutral-950 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 font-medium">
                      {service.tagline}
                    </p>
                  </div>

                  {/* Bottom Action Bar: Tactile Clay Buttons */}
                  <div className="pt-3 border-t border-neutral-300/40 flex items-center justify-between gap-2 relative z-10">
                    {/* View Blueprint Button */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onInspectService(service);
                      }}
                      className="px-3 py-2 text-xs font-bold text-neutral-700 hover:text-neutral-950 bg-white/70 hover:bg-white rounded-xl flex items-center gap-1 cursor-pointer transition-all border border-white shadow-2xs"
                    >
                      <span>Blueprint</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                    </button>

                    {/* Book This Service Button */}
                    <button
                      onClick={() => {
                        sound.playClick();
                        onBookService(service);
                      }}
                      className={`px-3.5 py-2 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all shadow-xs ${palette.btnBg}`}
                    >
                      <span>Book</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
