import { BookingData } from '../types';

const STORAGE_KEY = 'nexora_client_bookings_db';

export const getStoredBookings = (): BookingData[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

export const saveBooking = (booking: Omit<BookingData, 'id' | 'createdAt' | 'status'>): BookingData => {
  const newBooking: BookingData = {
    ...booking,
    id: `NX-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: 'confirmed',
  };

  const existing = getStoredBookings();
  const updated = [newBooking, ...existing];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Database write error:', err);
  }

  return newBooking;
};

export const deleteBooking = (id: string): void => {
  const existing = getStoredBookings();
  const filtered = existing.filter((b) => b.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Database delete error:', err);
  }
};

export const generateMailtoLink = (booking: {
  name: string;
  phone: string;
  address: string;
  email: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  projectBrief?: string;
}): string => {
  const recipient = 'admin@nexora.digital';
  const subject = encodeURIComponent(`[Nexora Discovery Meeting] - ${booking.name} (${booking.serviceTitle})`);
  
  const body = encodeURIComponent(
`Hello Nexora Engineering Team,

I would like to confirm a discovery meeting slot. Here are my verified details:

Full Name: ${booking.name}
Phone Number: ${booking.phone}
Address / Company: ${booking.address}
Email Address: ${booking.email}
Requested Service: ${booking.serviceTitle}
Preferred Date: ${booking.preferredDate}
Preferred Time Slot: ${booking.preferredTime}

Project Objectives & Brief:
${booking.projectBrief || 'Discuss tailored high-performance solution and architecture.'}

Best regards,
${booking.name}`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
};

export const downloadICSFile = (booking: BookingData) => {
  const dateStr = booking.preferredDate.replace(/-/g, '');
  const startHour = booking.preferredTime.includes('AM') ? '100000' : '150000';
  const endHour = booking.preferredTime.includes('AM') ? '104500' : '154500';

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Nexora Digital Agency//Discovery Session//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${booking.id}@nexora.agency`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    `DTSTART:${dateStr}T${startHour}Z`,
    `DTEND:${dateStr}T${endHour}Z`,
    `SUMMARY:Nexora Discovery Meeting: ${booking.serviceTitle}`,
    `DESCRIPTION:Discovery consultation with Nexora Engineering.\\nClient: ${booking.name}\\nPhone: ${booking.phone}\\nAddress: ${booking.address}\\nEmail: ${booking.email}\\nService: ${booking.serviceTitle}`,
    `LOCATION:Google Meet / Secure Telepresence (nexora.agency)`,
    `ORGANIZER;CN=Nexora Agency:mailto:admin@nexora.digital`,
    `ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;CN=${booking.name}:mailto:${booking.email}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Nexora-Discovery-${booking.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
