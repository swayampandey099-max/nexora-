import React, { useState, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Search,
  Sparkles,
  Zap,
  Globe,
  MessageSquare,
  Bot,
  ShieldCheck,
  ChevronDown,
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

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onInspectService,
  onBookService,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(SERVICES_DATA[0].id);

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

  const toggleExpand = (id: string) => {
    sound.playClick();
    setExpandedServiceId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="services" className="relative py-12 sm:py-16 border-y border-neutral-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-left">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
              <span>Full Service Spectrum (11 Capabilities)</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
              Interactive <span className="text-highlight">Capabilities Matrix</span>.
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              Explore our complete suite of custom digital engineering solutions. Filter by technology domain
              or search specific deliverables below.
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
                placeholder="Search capabilities (e.g. AI, WhatsApp, E-Commerce)..."
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
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
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

        {/* Results Counter */}
        {filteredServices.length === 0 ? (
          <div className="neo-card p-10 text-center space-y-3 my-6">
            <Sparkles className="w-8 h-8 text-amber-500 mx-auto" />
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
          /* Interactive Capabilities Accordion / Grid Showcase */
          <div className="space-y-4 text-left">
            {filteredServices.map((service) => {
              const isExpanded = expandedServiceId === service.id;

              return (
                <div
                  key={service.id}
                  className={`neo-card transition-all duration-300 overflow-hidden ${
                    isExpanded ? 'border-amber-400/80 shadow-lg' : ''
                  }`}
                >
                  {/* Card Header Bar */}
                  <div
                    onClick={() => toggleExpand(service.id)}
                    className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-white/40 transition-colors select-none"
                  >
                    <div className="flex items-start sm:items-center gap-4">
                      {/* Number Chip */}
                      <span className="neo-box w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-xs text-neutral-900 shrink-0">
                        {service.number}
                      </span>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-900 border border-amber-400/30 font-mono">
                            {service.category}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <Zap className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{service.metrics}</span>
                          </span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight">
                          {service.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-300/40">
                      <p className="text-xs text-neutral-600 line-clamp-1 max-w-sm hidden md:block">
                        {service.tagline}
                      </p>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            sound.playClick();
                            onBookService(service);
                          }}
                          className="px-3.5 py-1.5 text-xs font-bold clay-btn-yellow rounded-lg cursor-pointer"
                        >
                          Book Now
                        </button>

                        <div className={`p-2 rounded-lg neo-box transition-transform duration-200 ${isExpanded ? 'rotate-180 bg-amber-100' : ''}`}>
                          <ChevronDown className="w-4 h-4 text-neutral-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Blueprint Details Drawer */}
                  {isExpanded && (
                    <div className="p-5 sm:p-7 bg-[#F4F3ED]/90 border-t border-neutral-300/60 space-y-6 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                        {/* Image Showcase */}
                        <div className="lg:col-span-4 relative rounded-xl overflow-hidden aspect-16/10 sm:aspect-4/3 bg-neutral-200 shadow-md border border-white/80">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 right-3">
                            <span className="inline-block glass-chip bg-[#FDE047]/90 text-neutral-950 font-bold text-xs px-3 py-1 shadow-sm border border-amber-300">
                              {service.metrics}
                            </span>
                          </div>
                        </div>

                        {/* Description & Deliverables */}
                        <div className="lg:col-span-8 space-y-4">
                          <p className="text-sm text-neutral-700 leading-relaxed font-medium">
                            {service.description}
                          </p>

                          <div className="space-y-2 pt-2">
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                              Scope of Deliverables & System Architecture:
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {service.deliverables.map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-800 bg-white/70 p-2.5 rounded-lg border border-white">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="font-semibold">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Quick Action Buttons */}
                          <div className="pt-3 flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => {
                                sound.playClick();
                                onBookService(service);
                              }}
                              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider clay-btn-yellow rounded-xl cursor-pointer flex items-center gap-2"
                            >
                              <span>Reserve This Capability</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                sound.playClick();
                                onInspectService(service);
                              }}
                              className="px-4 py-2.5 text-xs font-bold uppercase tracking-wider clay-btn-neutral rounded-xl flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>View Full Technical Blueprint</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-amber-600" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
