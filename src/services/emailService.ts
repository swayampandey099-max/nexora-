export interface BookingEmailPayload {
  name: string;
  email: string;
  phone: string;
  address?: string;
  company?: string;
  serviceTitle: string;
  preferredDate: string;
  preferredTime: string;
  projectBrief: string;
}

const RECIPIENT_EMAIL = 'admin@nexora.digital';

export function formatBookingEmailBody(data: BookingEmailPayload): string {
  return [
    `Dear Nexora Engineering Team,`,
    ``,
    `I would like to schedule a 30-minute discovery session for Nexora's digital services:`,
    ``,
    `• Client Name: ${data.name}`,
    `• Contact Email: ${data.email}`,
    `• Phone Number: ${data.phone}`,
    `• Company / Brand: ${data.company || data.address || 'Independent'}`,
    `• Requested Capability: ${data.serviceTitle}`,
    `• Preferred Date: ${data.preferredDate}`,
    `• Preferred Time: ${data.preferredTime}`,
    ``,
    `Project Brief / Objectives:`,
    `${data.projectBrief || 'None provided'}`,
    ``,
    `Looking forward to your confirmation and Google Meet link.`,
  ].join('\n');
}

export function getMailtoLink(data: BookingEmailPayload): string {
  const subject = `Discovery Session Request - ${data.name} (${data.serviceTitle})`;
  const body = formatBookingEmailBody(data);
  return `mailto:${RECIPIENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getGmailWebLink(data: BookingEmailPayload): string {
  const subject = `Discovery Session Request - ${data.name} (${data.serviceTitle})`;
  const body = formatBookingEmailBody(data);
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${RECIPIENT_EMAIL}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function getOutlookWebLink(data: BookingEmailPayload): string {
  const subject = `Discovery Session Request - ${data.name} (${data.serviceTitle})`;
  const body = formatBookingEmailBody(data);
  return `https://outlook.live.com/mail/0/deeplink/compose?to=${RECIPIENT_EMAIL}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Dispatches to backend API endpoint (/api/send-email)
export async function sendBookingEmailApi(data: BookingEmailPayload): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, message: err.error || 'Server error dispatching email' };
    }

    const result = await res.json();
    return { success: true, message: result.message };
  } catch (error: any) {
    console.warn('API send-email error (falling back to direct client mailto):', error);
    return { success: false, message: error.message };
  }
}
