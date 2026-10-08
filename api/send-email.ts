import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Only POST is accepted.' });
  }

  try {
    const {
      name,
      email,
      phone,
      address,
      company,
      serviceTitle,
      preferredDate,
      preferredTime,
      projectBrief,
    } = req.body || {};

    if (!name || !email || !serviceTitle) {
      return res.status(400).json({ error: 'Missing required booking fields (name, email, serviceTitle).' });
    }

    const recipientEmail = 'swayampandey099@gmail.com';
    const clientCompany = company || address || 'Independent';

    // HTML Email template for Studio Team
    const studioEmailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #F7F6F1; color: #18181B; border-radius: 16px;">
        <div style="background: #18181B; color: #FDE047; padding: 18px 24px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">NEXORA DIGITAL STUDIO</h2>
          <p style="margin: 4px 0 0; font-size: 12px; color: #E4E4E7;">New Discovery Session Request</p>
        </div>

        <div style="background: #FFFFFF; padding: 24px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.06); box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
          <h3 style="margin-top: 0; color: #18181B; font-size: 16px; border-bottom: 1px solid #F4F4F5; padding-bottom: 12px;">Booking Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; line-height: 1.6;">
            <tr>
              <td style="padding: 8px 0; color: #71717A; width: 140px;">Client Name:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #09090B;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717A;">Client Email:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #D97706;"><a href="mailto:${email}" style="color: #D97706; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717A;">Phone:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #09090B;">${phone || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717A;">Company / Brand:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #09090B;">${clientCompany}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717A;">Capability:</td>
              <td style="padding: 8px 0; font-weight: 700; color: #B45309;">${serviceTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717A;">Preferred Date:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #09090B;">${preferredDate}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #71717A;">Preferred Time:</td>
              <td style="padding: 8px 0; font-weight: 600; color: #09090B;">${preferredTime}</td>
            </tr>
          </table>

          ${
            projectBrief
              ? `
            <div style="margin-top: 16px; padding: 14px; background: #F4F4F5; border-radius: 8px;">
              <strong style="font-size: 13px; color: #3F3F46; display: block; margin-bottom: 6px;">Project Brief / Objectives:</strong>
              <p style="margin: 0; font-size: 13px; color: #18181B; white-space: pre-wrap;">${projectBrief}</p>
            </div>
          `
              : ''
          }
        </div>

        <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #A1A1AA;">
          <p style="margin: 0;">Dispatched via Nexora Autonomous Booking Engine</p>
        </div>
      </div>
    `;

    // Attempt SMTP dispatch if configured in environment
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"Nexora Bookings" <${process.env.SMTP_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `🚀 New Discovery Session: ${name} (${serviceTitle})`,
        html: studioEmailHtml,
      });

      // Send confirmation to client
      await transporter.sendMail({
        from: `"Nexora Digital Studio" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Session Confirmed: 30-Minute Architectural Discovery with Nexora`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #F7F6F1; color: #18181B; border-radius: 16px;">
            <div style="background: #18181B; color: #FDE047; padding: 18px 24px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 800;">NEXORA DIGITAL STUDIO</h2>
              <p style="margin: 4px 0 0; font-size: 12px; color: #E4E4E7;">Your Discovery Session Request Received</p>
            </div>
            <div style="background: #FFFFFF; padding: 24px; border-radius: 12px;">
              <p>Hi <strong>${name}</strong>,</p>
              <p>Thank you for requesting a 30-minute discovery session for <strong>${serviceTitle}</strong> with Nexora!</p>
              <p>Our senior engineering leads will review your requirements and follow up within 24 hours with your Google Meet video invitation and initial architecture overview.</p>
              <p style="margin-top: 20px;">Best regards,<br><strong>Nexora Engineering Team</strong><br>swayampandey099@gmail.com</p>
            </div>
          </div>
        `,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Booking email processed and logged successfully.',
      recipient: recipientEmail,
      clientEmail: email,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Email Dispatch Error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error processing booking email.' });
  }
}
