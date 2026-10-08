import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Download,
  RotateCcw,
  ExternalLink,
  Copy,
  Check,
  Database,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SERVICES_DATA } from '../data/services';
import { BookingData } from '../types';
import { saveBooking, downloadICSFile } from '../utils/storage';
import { sound } from '../utils/audio';
import { saveBookingToFirestore, onAuthChange } from '../services/firebase';
import {
  getMailtoLink,
  getGmailWebLink,
  formatBookingEmailBody,
  sendBookingEmailApi,
} from '../services/emailService';

interface BookingSectionProps {
  initialServiceId?: string;
  initialTopic?: string;
  onBookingCreated?: () => void;
}

export const BookingSection: React.FC<BookingSectionProps> = ({
  initialServiceId,
  initialTopic,
  onBookingCreated,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState(initialServiceId || SERVICES_DATA[0].id);
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [projectBrief, setProjectBrief] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingData | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        if (!name && user.displayName) setName(user.displayName);
        if (!email && user.email) setEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, [name, email]);

  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setPreferredDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  useEffect(() => {
    if (initialTopic) {
      setProjectBrief((prev) => (prev ? `${prev}\nFocus: ${initialTopic}` : `Focus: ${initialTopic}`));
    }
  }, [initialTopic]);

  const selectedService = SERVICES_DATA.find((s) => s.id === selectedServiceId) || SERVICES_DATA[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim() || !email.trim()) return;

    sound.playClick();
    setIsSubmitting(true);

    const bookingPayload = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      company: address.trim(),
      email: email.trim(),
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      preferredDate,
      preferredTime,
      projectBrief: projectBrief.trim(),
    };

    try {
      // 1. Save to local storage for instant offline resilience
      const saved = saveBooking(bookingPayload);

      // 2. Persist to Firebase Firestore database in real time
      await saveBookingToFirestore({
        clientName: bookingPayload.name,
        clientEmail: bookingPayload.email,
        company: bookingPayload.company,
        serviceId: bookingPayload.serviceId,
        serviceName: bookingPayload.serviceTitle,
        preferredDate: bookingPayload.preferredDate,
        preferredTime: bookingPayload.preferredTime,
        notes: bookingPayload.projectBrief,
        status: 'confirmed',
      });

      // 3. Dispatch to backend email API
      await sendBookingEmailApi(bookingPayload);

      setConfirmedBooking(saved);
      setIsConfirmed(true);
      sound.playSuccess();

      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#F97316', '#FACC15', '#EA580C'],
        });
      } catch {
        // Confetti fallback
      }

      if (onBookingCreated) onBookingCreated();
    } catch (err) {
      console.error('Booking save error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyBrief = () => {
    if (!confirmedBooking) return;
    sound.playClick();
    const text = formatBookingEmailBody(confirmedBooking);
    navigator.clipboard.writeText(text);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2200);
  };

  const handleReset = () => {
    sound.playClick();
    setIsConfirmed(false);
    setConfirmedBooking(null);
    setName('');
    setPhone('');
    setAddress('');
    setEmail('');
    setProjectBrief('');
  };

  return (
    <section id="book" className="relative py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4 mb-8 sm:mb-10 text-left">
          <div className="text-xs uppercase tracking-widest font-bold text-amber-800 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 inline-block animate-pulse" />
            <span>Direct Scheduling & Email Dispatch</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            Schedule a <span className="text-highlight">Discovery Session</span>.
          </h2>
          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Reserve your project consultation with our engineering leads. Your meeting request is synchronized
            with our cloud database and dispatched directly to our studio inbox (
            <strong className="text-neutral-900 font-semibold">admin@nexora.digital</strong>).
          </p>
        </div>

        {/* Confirmation State or Form */}
        {isConfirmed && confirmedBooking ? (
          <div className="max-w-3xl mx-auto glass-chat-window p-8 sm:p-12 text-left space-y-6 animate-fadeIn border-2 border-amber-400 shadow-2xl">
            {/* Header with dual verification badges */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/60">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-neutral-900">Session Successfully Booked</h3>
                  <p className="text-xs text-neutral-500">
                    Dispatched to <strong className="text-orange-700">admin@nexora.digital</strong>
                  </p>
                </div>
              </div>

              {/* Database & Security Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1.5 glass-chip flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 border border-emerald-300 bg-emerald-50/70">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Firestore Synced</span>
                </div>
                <div className="px-3 py-1.5 glass-chip flex items-center gap-1.5 text-[11px] font-bold text-amber-900 border border-amber-300 bg-amber-50/70">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Encrypted TLS 1.3</span>
                </div>
              </div>
            </div>

            {/* Structured Booking Summary Card */}
            <div className="p-6 glass-card space-y-4 text-xs text-neutral-700 leading-relaxed border border-white/90">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-neutral-200/50">
                <div>
                  <span className="text-neutral-400 block font-medium">Client Name:</span>
                  <span className="font-bold text-neutral-900 text-sm">{confirmedBooking.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Requested Capability:</span>
                  <span className="font-bold text-orange-700 text-sm">{confirmedBooking.serviceTitle}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-3 border-b border-neutral-200/50">
                <div>
                  <span className="text-neutral-400 block font-medium">Email Address:</span>
                  <span className="font-bold text-neutral-900">{confirmedBooking.email}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Phone Number:</span>
                  <span className="font-bold text-neutral-900">{confirmedBooking.phone}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <span className="text-neutral-400 block font-medium">Address / Company:</span>
                  <span className="font-medium text-neutral-800">{confirmedBooking.address}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block font-medium">Scheduled Time Slot:</span>
                  <span className="font-bold text-neutral-900">
                    {confirmedBooking.preferredDate} at {confirmedBooking.preferredTime}
                  </span>
                </div>
              </div>

              {confirmedBooking.projectBrief && (
                <div className="pt-3 border-t border-neutral-200/50">
                  <span className="text-neutral-400 block font-medium">Project Notes:</span>
                  <p className="italic text-neutral-600 mt-1">"{confirmedBooking.projectBrief}"</p>
                </div>
              )}
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Our engineering team has received your request. We will review your requirements and follow up at{' '}
              <strong className="text-neutral-900">{confirmedBooking.email}</strong> within 24 hours with a calendar
              invitation and Google Meet video link.
            </p>

            {/* Multi-Device Email & Calendar Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-neutral-700">Quick Actions for Any Device:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {/* 1. Open in Gmail Web */}
                <a
                  href={getGmailWebLink(confirmedBooking)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sound.playClick()}
                  className="py-3 px-3 glass-btn-neutral text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 text-center cursor-pointer hover:text-orange-600"
                >
                  <Mail className="w-3.5 h-3.5 text-orange-600" />
                  <span>Open in Gmail</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>

                {/* 2. Send via Default Mail App (iOS / Android / Desktop) */}
                <a
                  href={getMailtoLink(confirmedBooking)}
                  onClick={() => sound.playClick()}
                  className="py-3 px-3 glass-btn-neutral text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 text-center cursor-pointer hover:text-amber-600"
                >
                  <Send className="w-3.5 h-3.5 text-amber-600" />
                  <span>Default Mail App</span>
                </a>

                {/* 3. Copy Email Brief */}
                <button
                  onClick={handleCopyBrief}
                  className="py-3 px-3 glass-btn-neutral text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  {copiedBrief ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Brief Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-neutral-600" />
                      <span>Copy Brief</span>
                    </>
                  )}
                </button>

                {/* 4. Save to Calendar (.ics) */}
                <button
                  onClick={() => {
                    sound.playClick();
                    downloadICSFile(confirmedBooking);
                  }}
                  className="py-3 px-3 glass-btn-neutral text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 text-center cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-amber-600" />
                  <span>Save .ICS</span>
                </button>
              </div>

              {/* Reset / Book Another */}
              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleReset}
                  className="py-2.5 px-5 glass-btn-yellow text-xs font-bold rounded-xl flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Submit Another Booking</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
            {/* Booking Form (7 Cols) in Glassmorphic Card */}
            <div className="lg:col-span-7 glass-card p-6 sm:p-10 border border-white/90">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Morgan"
                      className="w-full px-4 py-3 neo-inset text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none transition-all rounded-xl"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700">Phone Number *</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 234-5678"
                        className="w-full pl-10 pr-4 py-3 neo-inset text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none transition-all font-mono rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700">Work / Contact Email *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="alex@company.com"
                        className="w-full pl-10 pr-4 py-3 neo-inset text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none transition-all rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Address / Location */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700">Company / Brand Name *</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. Acme Tech, Inc."
                        className="w-full pl-10 pr-4 py-3 neo-inset text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none transition-all rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Capability Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">Primary Nexora Capability</label>
                  <select
                    value={selectedServiceId}
                    onChange={(e) => {
                      sound.playClick();
                      setSelectedServiceId(e.target.value);
                    }}
                    className="w-full px-4 py-3 neo-inset text-neutral-900 text-sm focus:outline-none font-medium cursor-pointer rounded-xl"
                  >
                    {SERVICES_DATA.map((srv) => (
                      <option key={srv.id} value={srv.id}>
                        {srv.title} — {srv.tagline}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date & Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange-600" />
                      <span>Preferred Date *</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-4 py-3 neo-inset text-neutral-900 text-sm focus:outline-none font-mono rounded-xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      <span>Preferred Time Slot *</span>
                    </label>
                    <select
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full px-4 py-3 neo-inset text-neutral-900 text-sm focus:outline-none font-medium cursor-pointer rounded-xl"
                    >
                      <option value="09:00 AM">09:00 AM (EST) / 02:00 PM (GMT)</option>
                      <option value="11:00 AM">11:00 AM (EST) / 04:00 PM (GMT)</option>
                      <option value="02:00 PM">02:00 PM (EST) / 07:00 PM (GMT)</option>
                      <option value="04:30 PM">04:30 PM (EST) / 09:30 PM (GMT)</option>
                    </select>
                  </div>
                </div>

                {/* Project Brief */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-700">Project Objectives / Target Goals</label>
                  <textarea
                    rows={4}
                    value={projectBrief}
                    onChange={(e) => setProjectBrief(e.target.value)}
                    placeholder="Describe your current tech stack, launch goals, or biggest bottlenecks..."
                    className="w-full px-4 py-3 neo-inset text-neutral-900 text-sm placeholder:text-neutral-400 focus:outline-none transition-all rounded-xl"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 glass-btn-yellow text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 rounded-xl"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {isSubmitting ? 'Recording & Dispatched to Inbox...' : 'Schedule 30-Min Discovery Session'}
                  </span>
                </button>

                <p className="text-[11px] text-center text-neutral-500">
                  Direct dispatch to <strong className="text-orange-700">admin@nexora.digital</strong>.
                  Protected by mutual NDA and stored in Firestore database.
                </p>
              </form>
            </div>

            {/* Sidebar Context Card (5 Cols) in Neomorphic Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-card p-6 sm:p-8 space-y-6 border border-white/90">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Architectural Review Agenda</span>
                </div>

                <div className="space-y-4 text-xs text-neutral-600">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-lg bg-orange-100 font-bold text-orange-700 flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">System & Stack Audit</h4>
                      <p className="mt-0.5">Teardown of your current performance, conversion leaks, and bottlenecks.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-lg bg-amber-100 font-bold text-amber-700 flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Bespoke Solution Mapping</h4>
                      <p className="mt-0.5">Matching your business to headless web, WhatsApp bots, or private AI.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-lg bg-yellow-100 font-bold text-yellow-800 flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <h4 className="font-bold text-neutral-900 text-sm">Fixed Scope & Timeline</h4>
                      <p className="mt-0.5">2 to 4-week delivery guarantee with weekly live demos and fixed milestones.</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 glass-chip rounded-xl space-y-2 border border-orange-200 bg-orange-50/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-900">
                    <Mail className="w-3.5 h-3.5 text-orange-600" />
                    <span>Direct Communication Channel</span>
                  </div>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    Direct access to senior engineering leads via dedicated Slack / Google Meet.
                    Inquiries: <strong className="text-orange-800">admin@nexora.digital</strong> · Instagram: <a href="https://instagram.com/nexora.sii_" target="_blank" rel="noopener noreferrer" className="font-bold text-pink-700 hover:underline">@nexora.sii_</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
