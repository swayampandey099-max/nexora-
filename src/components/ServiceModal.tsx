import React from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { sound } from '../utils/audio';

interface ServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSelectForBooking: (service: ServiceItem) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  service,
  onClose,
  onSelectForBooking,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-900/40 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Frosted Glass Window */}
      <div className="relative z-10 w-full max-w-2xl glass-chat-window overflow-hidden text-left flex flex-col max-h-[90vh]">
        {/* Header with real image */}
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-neutral-200">
          <img
            src={service.image}
            alt={service.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-neutral-950/30 to-transparent" />

          {/* Close button (Clay Neutral) */}
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 clay-btn-neutral rounded-lg text-neutral-800 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <p className="text-xs font-mono font-semibold text-amber-300 mb-1">
              CAPABILITY {service.number} · {service.category.toUpperCase()}
            </p>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {service.title}
            </h3>
          </div>
        </div>

        {/* Modal body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500 mb-2">
              Strategic Value & Approach
            </h4>
            <p className="text-neutral-700 text-sm sm:text-base leading-relaxed">
              {service.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-wider font-bold text-neutral-500 mb-3">
              Included Deliverables
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {service.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 neo-box text-xs text-neutral-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 neo-box flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs text-neutral-500 font-medium">Target Benchmark</p>
              <p className="text-sm font-bold text-neutral-900">{service.metrics}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-600 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Full Data Sovereignty Guarantee</span>
            </div>
          </div>
        </div>

        {/* Modal footer (Claymorphic Buttons) */}
        <div className="p-5 border-t border-neutral-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between gap-4">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2.5 clay-btn-neutral text-xs font-bold rounded-xl cursor-pointer"
          >
            Back
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectForBooking(service);
            }}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold uppercase tracking-wider clay-btn-yellow rounded-xl cursor-pointer"
          >
            <span>Book This Service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
