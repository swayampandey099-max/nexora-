import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  Shield,
  RefreshCw,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Mail,
  Copy,
  Trash2,
  Download,
  KeyRound,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  Lock,
  Building,
} from 'lucide-react';
import {
  fetchAllBookingsAdmin,
  fetchAllUsersAdmin,
  updateBookingStatus,
  deleteBookingRecord,
  BookingRecord,
  UserRecord,
  OWNER_EMAIL,
} from '../services/firebase';
import {
  updateOwnerPassword,
  revokeOwnerSession,
} from '../services/ownerAuth';
import { sound } from '../utils/audio';

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({
  isOpen,
  onClose,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'users' | 'security'>('bookings');
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Security password change states
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const [bookingsData, usersData] = await Promise.all([
        fetchAllBookingsAdmin().catch((err) => {
          console.warn('Could not fetch bookings:', err);
          return [];
        }),
        fetchAllUsersAdmin().catch((err) => {
          console.warn('Could not fetch users:', err);
          return [];
        }),
      ]);
      setBookings(bookingsData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error loading admin portal data:', err);
      setFeedbackMsg({ text: 'Error connecting to Firestore database.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      b.clientName?.toLowerCase().includes(q) ||
      b.clientEmail?.toLowerCase().includes(q) ||
      b.company?.toLowerCase().includes(q) ||
      b.serviceName?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Filter users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      u.displayName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.uid?.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (
    bookingId: string,
    newStatus: 'confirmed' | 'completed' | 'cancelled'
  ) => {
    sound.playClick();
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
      );
      setFeedbackMsg({ text: `Appointment status updated to ${newStatus}.`, type: 'success' });
      sound.playSuccess();
    } catch (err: any) {
      setFeedbackMsg({ text: 'Failed to update status in database.', type: 'error' });
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this booking record?')) {
      return;
    }
    sound.playClick();
    try {
      await deleteBookingRecord(bookingId);
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
      setFeedbackMsg({ text: 'Appointment deleted from Firestore.', type: 'success' });
    } catch (err: any) {
      setFeedbackMsg({ text: 'Could not delete booking record.', type: 'error' });
    }
  };

  const handleCopy = (id: string, text: string) => {
    sound.playClick();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setFeedbackMsg({ text: 'Master password must be at least 8 characters.', type: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedbackMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setIsChangingPass(true);
    sound.playClick();
    try {
      await updateOwnerPassword(newPassword);
      sound.playSuccess();
      setFeedbackMsg({
        text: 'Master password updated successfully with new cryptographic salt & SHA-256 hash.',
        type: 'success',
      });
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setFeedbackMsg({ text: 'Could not update password hash.', type: 'error' });
    } finally {
      setIsChangingPass(false);
    }
  };

  const exportToCSV = () => {
    sound.playClick();
    const rows = [
      ['ID', 'Client Name', 'Email', 'Company', 'Service', 'Date', 'Time Slot', 'Budget', 'Timeline', 'Status', 'Created At'],
      ...bookings.map((b) => [
        b.id || '',
        `"${b.clientName || ''}"`,
        `"${b.clientEmail || ''}"`,
        `"${b.company || ''}"`,
        `"${b.serviceName || ''}"`,
        `"${b.preferredDate || ''}"`,
        `"${b.preferredTime || ''}"`,
        `"${b.budget || ''}"`,
        `"${b.timeline || ''}"`,
        `"${b.status || ''}"`,
        `"${b.createdAt || ''}"`,
      ]),
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nexora_appointments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl animate-fadeIn overflow-hidden">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#0F0F12] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col text-neutral-100 overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-800/80 bg-neutral-950/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-white">
                  NEXORA EXECUTIVE PORTAL
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  OWNER VERIFIED
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Session Privilege: <strong className="text-amber-200">Authorized Anonymous Executive (Zero-Knowledge)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              title="Refresh Data from Cloud"
              className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
            <button
              onClick={exportToCSV}
              title="Export Bookings to CSV"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-xs font-semibold text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                revokeOwnerSession();
                onLogout();
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 text-xs font-bold transition-colors cursor-pointer"
            >
              Exit Session
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedbackMsg && (
          <div
            className={`px-6 py-2.5 text-xs font-medium flex items-center justify-between shrink-0 ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/15 border-b border-rose-500/30 text-rose-300'
            }`}
          >
            <span>{feedbackMsg.text}</span>
            <button onClick={() => setFeedbackMsg(null)} className="cursor-pointer">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Tabs & Metrics */}
        <div className="px-6 py-3 border-b border-neutral-800/80 bg-neutral-900/50 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('bookings');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Appointments & Leads</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-950/20 font-mono">
                {bookings.length}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('users');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Users</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-950/20 font-mono">
                {users.length}
              </span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('security');
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-amber-400 text-neutral-950 shadow-md'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Security & Passwords</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-neutral-400">
            <div>
              Confirmed:{' '}
              <strong className="text-emerald-400 font-mono">
                {bookings.filter((b) => b.status === 'confirmed').length}
              </strong>
            </div>
            <div>
              Completed:{' '}
              <strong className="text-sky-400 font-mono">
                {bookings.filter((b) => b.status === 'completed').length}
              </strong>
            </div>
            <div>
              Live DB:{' '}
              <span className="text-neutral-300 font-mono text-[11px]">Firestore Online</span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          
          {/* TAB 1: BOOKINGS & APPOINTMENTS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {/* Controls Bar: Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by client, company, service..."
                    className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                  {(['all', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        sound.playClick();
                        setStatusFilter(st);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize whitespace-nowrap cursor-pointer transition-colors ${
                        statusFilter === st
                          ? 'bg-neutral-800 text-amber-300 font-bold border border-amber-400/30'
                          : 'text-neutral-400 hover:text-white bg-neutral-900/60'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookings List */}
              {isLoading ? (
                <div className="py-20 text-center text-neutral-500 text-sm flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Loading bookings from Firestore...</span>
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-neutral-800 bg-neutral-950/40 p-8">
                  <Calendar className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-neutral-300">No Appointments Found</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No appointments matched your search query.'
                      : 'No discovery sessions have been booked yet. New client bookings will appear here instantly.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700/80 transition-all shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                    >
                      {/* Left: Client & Service Details */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-base text-white">
                            {booking.clientName}
                          </span>
                          {booking.company && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-neutral-800 text-neutral-300 flex items-center gap-1 border border-neutral-700">
                              <Building className="w-3 h-3 text-amber-400" />
                              {booking.company}
                            </span>
                          )}
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : booking.status === 'completed'
                                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400">
                          <span className="text-amber-300 font-semibold">{booking.serviceName}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-neutral-300">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {booking.preferredDate} at {booking.preferredTime}
                          </span>
                          {booking.budget && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-400 font-medium">Budget: {booking.budget}</span>
                            </>
                          )}
                          {booking.timeline && (
                            <>
                              <span>•</span>
                              <span className="text-neutral-300">Timeline: {booking.timeline}</span>
                            </>
                          )}
                        </div>

                        {booking.notes && (
                          <div className="text-xs text-neutral-300 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800/80 mt-1 max-w-3xl">
                            <strong className="text-neutral-400">Client Brief:</strong> {booking.notes}
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                          <span>Email: <span className="text-neutral-300 select-all">{booking.clientEmail}</span></span>
                          <span>•</span>
                          <span>Created: {new Date(booking.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0 self-end lg:self-center">
                        {/* Status Dropdown / Buttons */}
                        <div className="flex items-center gap-1 bg-neutral-950/70 p-1 rounded-xl border border-neutral-800">
                          <button
                            onClick={() => booking.id && handleStatusChange(booking.id, 'confirmed')}
                            title="Mark as Confirmed"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              booking.status === 'confirmed'
                                ? 'bg-emerald-500 text-neutral-950'
                                : 'text-neutral-400 hover:text-emerald-300'
                            }`}
                          >
                            Confirmed
                          </button>
                          <button
                            onClick={() => booking.id && handleStatusChange(booking.id, 'completed')}
                            title="Mark as Completed"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              booking.status === 'completed'
                                ? 'bg-sky-500 text-neutral-950'
                                : 'text-neutral-400 hover:text-sky-300'
                            }`}
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => booking.id && handleStatusChange(booking.id, 'cancelled')}
                            title="Mark as Cancelled"
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition-colors ${
                              booking.status === 'cancelled'
                                ? 'bg-rose-500 text-neutral-950'
                                : 'text-neutral-400 hover:text-rose-300'
                            }`}
                          >
                            Cancelled
                          </button>
                        </div>

                        {/* Reply Email */}
                        <a
                          href={`mailto:${booking.clientEmail}?subject=${encodeURIComponent(
                            `Nexora Consultation Confirmation: ${booking.serviceName}`
                          )}&body=${encodeURIComponent(
                            `Hi ${booking.clientName},\n\nThank you for scheduling your discovery session with Nexora.\n\nWe have your consultation confirmed for ${booking.preferredDate} at ${booking.preferredTime}.\n\nLooking forward to speaking with you!\n\nBest regards,\nNexora Admin\nNexora Digital Studio`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer"
                          title="Compose Email to Client"
                        >
                          <Mail className="w-4 h-4" />
                        </a>

                        {/* Copy ID */}
                        <button
                          onClick={() =>
                            handleCopy(
                              booking.id || '',
                              `Client: ${booking.clientName}\nEmail: ${booking.clientEmail}\nService: ${booking.serviceName}\nDate: ${booking.preferredDate} ${booking.preferredTime}`
                            )
                          }
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                          title="Copy Booking Summary"
                        >
                          {copiedId === booking.id ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => booking.id && handleDeleteBooking(booking.id)}
                          className="p-2 rounded-xl bg-neutral-800 hover:bg-rose-900/40 text-neutral-400 hover:text-rose-300 transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: REGISTERED USERS & ACCOUNTS */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, or UID..."
                    className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
                <div className="text-xs text-neutral-400">
                  Total Registered Accounts: <strong className="text-amber-300 font-mono">{users.length}</strong>
                </div>
              </div>

              {isLoading ? (
                <div className="py-20 text-center text-neutral-500 text-sm flex flex-col items-center justify-center gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
                  <span>Loading user profiles from Firestore...</span>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-20 text-center rounded-2xl border border-neutral-800 bg-neutral-950/40 p-8">
                  <Users className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-neutral-300">No Users Found</h3>
                  <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? 'No registered profiles matched your search.'
                      : 'Clients who sign in via Google or Email will appear in this registry.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.uid}
                      className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800/80 flex items-center justify-between gap-3 hover:border-neutral-700/80 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full object-cover shrink-0 border border-neutral-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center font-bold text-sm shrink-0">
                            {user.displayName?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white truncate">
                              {user.displayName || 'Client'}
                            </span>
                            {user.email === OWNER_EMAIL && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                ANONYMOUS ROOT
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 truncate select-all">
                            {user.email === OWNER_EMAIL ? '••••••••••••••••••••• [Encrypted Owner ID]' : user.email}
                          </p>
                          <p className="text-[10px] text-neutral-500 mt-0.5 font-mono truncate">
                            UID: {user.uid}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`mailto:${user.email}`}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer shrink-0"
                        title="Email User"
                      >
                        <Mail className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SECURITY & PASSWORD SETTINGS */}
          {activeTab === 'security' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Security Shield Card */}
              <div className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 space-y-4">
                <div className="flex items-center gap-3 text-amber-400">
                  <Shield className="w-6 h-6" />
                  <h3 className="font-extrabold text-base text-white">
                    Cryptographic Security Architecture
                  </h3>
                </div>
                <div className="space-y-2 text-xs text-neutral-300 leading-relaxed">
                  <p>
                    • <strong>One-Way Hashing:</strong> Credentials are mathematically hashed using{' '}
                    <span className="font-mono text-amber-300">Web Crypto SHA-256</span> combined with a high-entropy salt. Even with full access to the source code, the plain password cannot be extracted.
                  </p>
                  <p>
                    • <strong>Brute-Force Rate Limiting:</strong> Maximum 5 attempts allowed. Exceeding 5 attempts initiates a progressive 15-minute lockout timer.
                  </p>
                  <p>
                    • <strong>Google OAuth2 JWT Verification:</strong> Cloud-authenticated logins verify tokens against Google’s public certificate servers.
                  </p>
                </div>
              </div>

              {/* Change Master Password Form */}
              <form
                onSubmit={handlePasswordChangeSubmit}
                className="p-6 rounded-2xl bg-neutral-900/80 border border-neutral-800/90 space-y-4"
              >
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Update Master Portal Password</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    New Master Password (min 8 chars)
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new master password..."
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    disabled={isChangingPass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                    Confirm New Master Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new master password..."
                    className="w-full px-4 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                    disabled={isChangingPass}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer shadow-md"
                >
                  {isChangingPass ? 'Computing New SHA-256 Hash...' : 'Update & Re-Hash Master Password'}
                </button>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
