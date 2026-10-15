import React, { useState } from 'react';
import { Shield, KeyRound, LogIn, X, AlertCircle, Lock } from 'lucide-react';
import { signInWithGoogle, isUserOwner } from '../services/firebase';
import { verifyOwnerPassword, grantOwnerSession } from '../services/ownerAuth';
import { sound } from '../utils/audio';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'options' | 'password'>('options');
  const [username, setUsername] = useState('admin@nexora.digital');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    sound.playClick();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const user = await signInWithGoogle();
      if (user && isUserOwner(user)) {
        sound.playSuccess();
        grantOwnerSession();
        onSuccess();
      } else if (user) {
        sound.playError();
        setErrorMessage(
          `Signed in as ${user.email}, but this account does not have owner privileges. Please sign in with an authorized owner account.`
        );
      }
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setErrorMessage('Google Authentication was cancelled or encountered a network error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const result = await verifyOwnerPassword(username, password);
      if (result.success) {
        sound.playSuccess();
        grantOwnerSession();
        onSuccess();
      } else {
        sound.playError();
        setErrorMessage(result.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      console.error('Password verify error:', err);
      setErrorMessage('An error occurred during verification.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 neo-card bg-[#F7F6F1] border border-white/90 shadow-2xl rounded-3xl text-left space-y-6">
        
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-neutral-900 neo-box cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-950 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0 shadow-md">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800 block">
              Restricted Area
            </span>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight">
              Executive Admin Portal
            </h3>
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed font-medium">
          Authorized command center for Nexora founders and administrators to view live bookings, client leads, and system telemetry.
        </p>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {authMode === 'options' ? (
          <div className="space-y-3 pt-2">
            {/* Primary Option: Google Authentication */}
            <button
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl clay-btn-yellow text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Authorized Google Account'}</span>
            </button>

            {/* Secondary Option: Master Passcode */}
            <button
              onClick={() => {
                sound.playClick();
                setAuthMode('password');
              }}
              className="w-full py-3 px-4 rounded-xl neo-box text-xs font-semibold text-neutral-700 hover:text-neutral-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-amber-700" />
              <span>Use Admin Master Password</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                Admin Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full neo-inset px-3.5 py-2.5 rounded-xl text-xs text-neutral-900 focus:outline-none font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password..."
                className="w-full neo-inset px-3.5 py-2.5 rounded-xl text-xs text-neutral-900 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setAuthMode('options');
                  setErrorMessage(null);
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-neutral-600 hover:text-neutral-900 neo-box cursor-pointer"
              >
                Back
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 px-4 rounded-xl clay-btn-yellow text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Verifying...' : 'Unlock Portal'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
