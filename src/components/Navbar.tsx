import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  ArrowUpRight,
  Menu,
  X,
  LogIn,
  LogOut,
  User as UserIcon,
  Shield,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { signInWithGoogle, logOut, onAuthChange, isUserOwner } from '../services/firebase';
import { grantOwnerSession, isOwnerSessionActive } from '../services/ownerAuth';
import { User } from 'firebase/auth';

interface NavbarProps {
  onBookClick: () => void;
  onOpenOwnerPortal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookClick, onOpenOwnerPortal }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      if (isUserOwner(user)) {
        grantOwnerSession();
      }
    });
    return () => unsubscribe();
  }, []);

  const isOwner = isUserOwner(currentUser) || isOwnerSessionActive();

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
    if (!next) sound.playClick();
  };

  const handleNavClick = () => {
    sound.playClick();
    setMobileMenuOpen(false);
  };

  const handleGoogleAuth = async () => {
    if (currentUser) {
      sound.playClick();
      await logOut();
    } else {
      setIsSigningIn(true);
      sound.playClick();
      try {
        const user = await signInWithGoogle();
        sound.playSuccess();
        // If owner signs in with Google, immediately launch Owner Command Center
        if (user && isUserOwner(user)) {
          grantOwnerSession();
          onOpenOwnerPortal();
        }
      } catch (err) {
        console.error('Sign-in failed:', err);
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Lockup */}
        <a
          href="#"
          onClick={handleNavClick}
          className="flex items-center gap-3 group focus:outline-none"
        >
          <span className="font-black text-2xl tracking-tighter text-neutral-900 group-hover:text-amber-600 group-hover:scale-110 transition-transform duration-200">
            N
          </span>
          <div className="flex flex-col text-left">
            <span className="font-extrabold text-base tracking-tight text-neutral-900 leading-tight">
              NEXORA
            </span>
            <span className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold">
              Digital Studio
            </span>
          </div>
        </a>

        {/* Clean Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-7">
          <a
            href="#services"
            onClick={handleNavClick}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            Services
          </a>
          <a
            href="#approach"
            onClick={handleNavClick}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            Process
          </a>
          <a
            href="#security"
            onClick={handleNavClick}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            Security & Trust
          </a>
          <a
            href="#case-studies"
            onClick={handleNavClick}
            className="text-sm font-medium text-neutral-600 hover:text-neutral-950 transition-colors"
          >
            Results
          </a>
        </nav>

        {/* Action Controls with Glassmorphic Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2.5 glass-btn-neutral text-neutral-700 hover:text-neutral-950 cursor-pointer rounded-xl"
            aria-label="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
          </button>

          {/* Dedicated Owner Portal Access Button - ONLY visible when authenticated as owner */}
          {isOwner && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenOwnerPortal();
              }}
              title="Owner & Executive Command Portal"
              className="p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-1.5 bg-neutral-950 text-amber-300 border border-amber-400/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
              aria-label="Owner Access Portal"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider hidden sm:inline">
                Owner HQ
              </span>
            </button>
          )}

          {/* Firebase Google Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 glass-chip rounded-xl">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-neutral-900 flex items-center justify-center text-[10px] font-bold">
                    <UserIcon className="w-3 h-3" />
                  </div>
                )}
                <span className="hidden lg:inline text-xs font-semibold text-neutral-800 max-w-[100px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Client'}
                </span>
              </div>
              <button
                onClick={handleGoogleAuth}
                title="Sign Out"
                className="p-2 glass-btn-neutral rounded-xl text-neutral-600 hover:text-rose-600 cursor-pointer"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleGoogleAuth}
              disabled={isSigningIn}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold glass-btn-neutral rounded-xl cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-600" />
              <span>{isSigningIn ? 'Connecting...' : 'Sign In'}</span>
            </button>
          )}

          {/* Book Call CTA */}
          <button
            onClick={() => {
              sound.playClick();
              onBookClick();
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-bold glass-btn-yellow rounded-xl cursor-pointer"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2.5 glass-btn-neutral text-neutral-700 rounded-xl cursor-pointer"
            aria-label="Open Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Frosted Glass Panel) */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-chat-window m-4 p-6 flex flex-col gap-4 text-left animate-fadeIn border border-white/90">
          <nav className="flex flex-col gap-3">
            <a
              href="#services"
              onClick={handleNavClick}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-white/60 transition-colors"
            >
              Services (11 Capabilities)
            </a>
            <a
              href="#approach"
              onClick={handleNavClick}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-white/60 transition-colors"
            >
              4-Step Process & Architecture
            </a>
            <a
              href="#security"
              onClick={handleNavClick}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-white/60 transition-colors"
            >
              Enterprise Security & NDA
            </a>
            <a
              href="#case-studies"
              onClick={handleNavClick}
              className="px-3 py-2 rounded-lg text-sm font-semibold text-neutral-700 hover:bg-white/60 transition-colors"
            >
              Client Metrics & Results
            </a>
          </nav>

          <div className="pt-4 border-t border-neutral-200/60 flex flex-col gap-3">
            {isOwner && (
              <button
                onClick={() => {
                  sound.playClick();
                  setMobileMenuOpen(false);
                  onOpenOwnerPortal();
                }}
                className="w-full py-2.5 rounded-xl bg-neutral-950 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer border border-amber-400/40"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Executive Owner Portal</span>
              </button>
            )}

            {!currentUser && (
              <button
                onClick={handleGoogleAuth}
                className="w-full py-2.5 glass-btn-neutral rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4 text-amber-600" />
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="w-full py-3 glass-btn-yellow rounded-xl text-xs uppercase tracking-wider font-bold text-neutral-900 cursor-pointer text-center"
            >
              Schedule Discovery Call
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
