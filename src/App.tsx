import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CertificationBanner } from './components/CertificationBanner';
import { ServicesSection } from './components/ServicesSection';
import { ArchitectureMatrix } from './components/ArchitectureMatrix';
import { SecuritySection } from './components/SecuritySection';
import { ProofSection } from './components/ProofSection';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { ServiceModal } from './components/ServiceModal';
import { SmokeBackground } from './components/SmokeBackground';
import { NexoraChatbot } from './components/NexoraChatbot';
import { OwnerPortalModal } from './components/OwnerPortalModal';
import { ServiceItem } from './types';
import { onAuthChange, isUserOwner, logOut } from './services/firebase';
import { grantOwnerSession, revokeOwnerSession } from './services/ownerAuth';
import { loadManager } from './utils/loadManager';
import blueprintBg from './assets/images/blueprint_v2_bg_opt.webp';

export default function App() {
  const [inspectedService, setInspectedService] = useState<ServiceItem | null>(null);
  const [bookingServiceId, setBookingServiceId] = useState<string | undefined>(undefined);
  const [bookingTopic, setBookingTopic] = useState<string | undefined>(undefined);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Preload background image & critical assets asynchronously for zero latency
  useEffect(() => {
    loadManager.preloadImage(blueprintBg).then(() => {
      setBgLoaded(true);
    });
  }, []);

  // Owner authentication state: ONLY true if signed in as Nexora Admin
  const [isOwner, setIsOwner] = useState(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState(false);

  // Monitor Firebase auth: Automatically open Admin Portal when authorized owner signs in
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      const ownerAuthorized = isUserOwner(user);
      setIsOwner(ownerAuthorized);
      if (ownerAuthorized) {
        grantOwnerSession();
        setIsOwnerPortalOpen(true);
      } else {
        revokeOwnerSession();
        setIsOwnerPortalOpen(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleOpenOwnerPortal = () => {
    if (isOwner) {
      setIsOwnerPortalOpen(true);
    }
  };

  const handleOwnerLogout = async () => {
    revokeOwnerSession();
    setIsOwnerPortalOpen(false);
    setIsOwner(false);
    try {
      await logOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const scrollToBooking = (serviceId?: string, topic?: string) => {
    if (serviceId) setBookingServiceId(serviceId);
    if (topic) setBookingTopic(topic);
    const bookEl = document.getElementById('book');
    if (bookEl) {
      bookEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleInspectService = (service: ServiceItem) => {
    setInspectedService(service);
  };

  const handleBookFromCard = (service: ServiceItem) => {
    setInspectedService(null);
    scrollToBooking(service.id, `Service: ${service.title}`);
  };

  const handleBookFromArchitecture = (topic: string) => {
    scrollToBooking(undefined, topic);
  };

  return (
    <div className="relative min-h-screen bg-[#F7F6F1] text-[#18181B] flex flex-col selection:bg-[#FACC15] selection:text-neutral-900 overflow-x-clip">
      {/* Engineering Blueprint Background Panel for Entire Website */}
      <div
        className={`fixed inset-0 z-0 bg-repeat bg-center transition-opacity duration-300 pointer-events-none mix-blend-multiply ${
          bgLoaded ? 'opacity-45' : 'opacity-0'
        }`}
        style={{
          backgroundImage: `url(${blueprintBg})`,
          backgroundSize: '700px auto'
        }}
      />

      {/* 2D Animated Smoke Pattern that follows the cursor in the background */}
      <SmokeBackground />

      {/* Top Glassmorphic Navigation with Owner Access (Exclusively for Nexora Admin) */}
      <Navbar
        onBookClick={() => scrollToBooking()}
        onOpenOwnerPortal={handleOpenOwnerPortal}
      />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1">
        {/* Clean Editorial Hero */}
        <Hero onBookClick={() => scrollToBooking()} />

        {/* Continuous Left-to-Right Salesforce & Engineering Certification Ticker */}
        <CertificationBanner />

        {/* 11 Services Swipe Deck with Smooth Animation & Real Photography */}
        <ServicesSection
          onInspectService={handleInspectService}
          onBookService={handleBookFromCard}
        />

        {/* 4-Step Process & Methodology */}
        <ArchitectureMatrix onBookServiceWithTopic={handleBookFromArchitecture} />

        {/* Enterprise Security & Data Governance */}
        <SecuritySection />

        {/* Quantified Client Outcomes */}
        <ProofSection />

        {/* Direct Meeting Booking (No mail client redirect, instant confirmation) */}
        <BookingSection
          initialServiceId={bookingServiceId}
          initialTopic={bookingTopic}
        />
      </main>

      {/* Clean Footer (Owner portal button only appears if authenticated as owner) */}
      <Footer
        isOwner={isOwner}
        onOpenOwnerPortal={handleOpenOwnerPortal}
      />

      {/* Service Blueprint Modal */}
      <ServiceModal
        service={inspectedService}
        onClose={() => setInspectedService(null)}
        onSelectForBooking={handleBookFromCard}
      />

      {/* Dedicated Topic-Focused Nexora Chatbot (Glassmorphic Window + Clay Controls) */}
      <NexoraChatbot onBookClick={() => scrollToBooking()} />

      {/* Executive Command Center / Owner Portal Modal - Exclusively rendered for Nexora Admin */}
      {isOwner && (
        <OwnerPortalModal
          isOpen={isOwnerPortalOpen}
          onClose={() => setIsOwnerPortalOpen(false)}
          onLogout={handleOwnerLogout}
        />
      )}
    </div>
  );
}
