const { Resend } = require('resend');

const getResendInstance = () => {
  if (process.env.ENABLE_LOAD_TEST_MODE === 'true') {
    console.log('🧪 Load Test Mode active: Mocking Resend email sending (0 API calls sent).');
    return null;
  }
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY is missing in environment variables.');
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
};

/**
 * Send delegate registration & payment status update email via Resend
 * @param {Object} delegate - The delegate database object
 */
const sendDelegateConfirmationEmail = async (delegate, rawToken = null) => {
  try {
    if (!delegate || !delegate.email) {
      console.error('Cannot send delegate email: Missing recipient email address.');
      return { success: false, error: 'Missing email' };
    }

    const resend = getResendInstance();
    if (!resend) {
      console.warn('Skipping email send: Resend client not configured.');
      return { success: false, error: 'Resend not configured' };
    }

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'BRAND R.Comm 2026 <onboarding@resend.dev>';
    const isPaid = delegate.paymentStatus === 'Paid';
    const isFailed = delegate.paymentStatus === 'Failed';

    let subject = `🎉 Registration Received: BRAND R.Comm Summit 2026 (${delegate.fullName})`;
    let messageText = `Thank you for registering for <strong>BRAND R.Comm 2026</strong>! Your registration details have been successfully received. We are excited to have you join us for the summit.`;
    let statusBadge = `<span style="background: #fef08a; color: #854d0e; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Pending</span>`;

    if (isPaid) {
      subject = `✅ Payment Confirmed: BRAND R.Comm Summit 2026 (${delegate.fullName})`;
      messageText = `Great news! Your payment for <strong>BRAND R.Comm 2026</strong> has been successfully verified. Your delegate pass is fully confirmed!`;
      statusBadge = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Paid</span>`;
    } else if (isFailed) {
      subject = `⚠️ Payment Failed: BRAND R.Comm Summit 2026 (${delegate.fullName})`;
      messageText = `Your payment attempt for <strong>BRAND R.Comm 2026</strong> could not be completed. Your registration details remain safely saved with us as pending.`;
      statusBadge = `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Failed</span>`;
    }

    const formattedAmount = delegate.delegateType === 'foreign' 
      ? `USD ${delegate.amountPaid || delegate.totalAmount || 250}` 
      : `₹${(delegate.amountPaid || delegate.totalAmount || 5664).toLocaleString('en-IN')}`;

    const tokenParam = rawToken ? `?token=${rawToken}` : '';
    const resumeUrl = `${process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app'}${tokenParam}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #1a1a1a; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background-color: #6a9a38; padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 18px; font-weight: 700; color: #2d3748; margin-bottom: 12px; }
        .message { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px; }
        .details-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .details-card h3 { margin-top: 0; margin-bottom: 16px; font-size: 15px; color: #6a9a38; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #6a9a38; padding-bottom: 8px; display: inline-block; }
        .event-info { background: #1a202c; color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: center; }
        .event-info h4 { margin: 0 0 8px; font-size: 16px; color: #a3e635; text-transform: uppercase; }
        .event-info p { margin: 4px 0; font-size: 13px; color: #cbd5e1; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .footer a { color: #6a9a38; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BRAND R.Comm 2026</h1>
          <p>5th Agriculture & Rural Communication Summit & Awards</p>
        </div>
        
        <div class="content">
          <div class="greeting">Dear ${delegate.fullName},</div>
          <div class="message">
            ${messageText}
          </div>

          <div class="details-card">
            <h3>Registration Details</h3>
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Registration ID:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right; font-family: monospace;">${delegate._id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Full Name:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right;">${delegate.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Organization:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${delegate.organization}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Designation:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${delegate.designation}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Category:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${delegate.attendeeCategory || 'DELEGATE'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment Status:</td>
                <td style="padding: 6px 0; text-align: right;">${statusBadge}</td>
              </tr>
              ${delegate.razorpayPaymentId ? `
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment ID:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 13px; font-family: monospace; text-align: right;">${delegate.razorpayPaymentId}</td>
              </tr>
              ` : ''}
              ${delegate.amountPaid ? `
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Amount Paid:</td>
                <td style="padding: 6px 0; color: #6a9a38; font-size: 15px; font-weight: 700; text-align: right;">${formattedAmount}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          ${!isPaid ? `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resumeUrl}" style="background-color: #6a9a38; color: #ffffff; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(106, 154, 56, 0.3);">
              Complete Your Payment →
            </a>
          </div>
          ` : ''}

          <div class="event-info">
            <h4>📅 Event Schedule & Venue</h4>
            <p><strong>Date:</strong> Friday, 27th February 2026</p>
            <p><strong>Venue:</strong> Holiday Inn, Aerocity, New Delhi</p>
          </div>

          <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center;">
            Please carry a copy of this email or your Registration ID on the day of the event for seamless check-in.
          </p>
        </div>

        <div class="footer">
          <p>© 2026 BRAND R.Comm — Snail Integral. All rights reserved.</p>
          <p>For any queries, contact us at <a href="mailto:info@brandrcomm.com">info@brandrcomm.com</a></p>
        </div>
      </div>
    </body>
    </html>
    `;

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [delegate.email],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.warn(`⚠️ Resend email sending warning for ${delegate.email}: ${error.message}`);
      if (error.name === 'validation_error' && error.message.includes('testing emails')) {
        console.warn(`💡 TIP: To send emails to any recipient, add & verify your domain at https://resend.com/domains and set RESEND_FROM_EMAIL in .env.`);
      }
      return { success: false, error: error.message };
    }

    console.log(`✉️ Delegate email (${delegate.paymentStatus}) sent successfully to ${delegate.email}`);
    // ── Send Internal Notification to Team Members (ADMIN_NOTIFICATION_EMAILS) ──
    sendAdminNotificationEmail('delegate', delegate).catch(err => console.error('Error sending team notification:', err));

    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending delegate email via Resend:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send internal notification email to team members dealing with attendees
 * @param {string} entityType - 'delegate' or 'nomination'
 * @param {Object} data - Database document
 */
const sendAdminNotificationEmail = async (entityType, dataDoc) => {
  try {
    const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAILS || "")
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);

    if (adminEmails.length === 0) return;

    const resend = getResendInstance();
    if (!resend) return;

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'BRAND R.Comm 2026 <onboarding@resend.dev>';
    const isPaid = dataDoc.paymentStatus === 'Paid';
    const regId = dataDoc._id ? dataDoc._id.toString().slice(-8).toUpperCase() : 'N/A';
    const typeLabel = entityType === 'delegate' ? 'Delegate Registration' : 'Award Nomination';

    const subject = isPaid
      ? `💰 [PAYMENT RECEIVED] ${typeLabel} #${regId} — ${dataDoc.fullName}`
      : `🚨 [NEW REGISTRATION] ${typeLabel} #${regId} — ${dataDoc.fullName} (Pending)`;

    const formattedAmount = dataDoc.delegateType === 'foreign'
      ? `USD ${dataDoc.amountPaid || dataDoc.totalAmount || 250}`
      : `₹${(dataDoc.amountPaid || dataDoc.totalAmount || 5664).toLocaleString('en-IN')}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1a1a1a; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 28px; border: 1px solid #e2e8f0; }
        .header { border-bottom: 2px solid ${isPaid ? '#16a34a' : '#ea580c'}; padding-bottom: 12px; margin-bottom: 20px; }
        .badge { background: ${isPaid ? '#dcfce7' : '#ffedd5'}; color: ${isPaid ? '#15803d' : '#c2410c'}; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table td { padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        .label { color: #64748b; font-weight: 600; }
        .value { text-align: right; font-weight: 700; color: #0f172a; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">${isPaid ? 'Payment Confirmed' : 'Registration Pending'}</span>
          <h2 style="margin: 10px 0 0; font-size: 20px; color: #0f172a;">${subject}</h2>
        </div>
        <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
          An update has occurred on <strong>BRAND R.Comm 2026</strong>. Here are the details for your team records:
        </p>
        <table class="table">
          <tr><td class="label">Attendee Name:</td><td class="value">${dataDoc.fullName}</td></tr>
          <tr><td class="label">Registration ID:</td><td class="value" style="font-family: monospace;">#${regId}</td></tr>
          <tr><td class="label">Email Address:</td><td class="value"><a href="mailto:${dataDoc.email}">${dataDoc.email}</a></td></tr>
          <tr><td class="label">Mobile Number:</td><td class="value"><a href="tel:${dataDoc.mobileNumber}">${dataDoc.mobileNumber}</a></td></tr>
          <tr><td class="label">Organization:</td><td class="value">${dataDoc.organization || 'N/A'}</td></tr>
          <tr><td class="label">Designation:</td><td class="value">${dataDoc.designation || 'N/A'}</td></tr>
          <tr><td class="label">City / State:</td><td class="value">${dataDoc.city ? `${dataDoc.city}, ${dataDoc.stateCountry}` : 'N/A'}</td></tr>
          <tr><td class="label">Payment Status:</td><td class="value" style="color: ${isPaid ? '#16a34a' : '#ea580c'};">${dataDoc.paymentStatus}</td></tr>
          <tr><td class="label">Amount (${isPaid ? 'Paid' : 'Due'}):</td><td class="value">${formattedAmount}</td></tr>
          ${dataDoc.razorpayPaymentId ? `<tr><td class="label">Razorpay Payment ID:</td><td class="value" style="font-family: monospace;">${dataDoc.razorpayPaymentId}</td></tr>` : ''}
          ${dataDoc.couponCode ? `<tr><td class="label">Coupon Used:</td><td class="value" style="color: #65a30d;">${dataDoc.couponCode}</td></tr>` : ''}
        </table>
        <div style="margin-top: 24px; padding: 12px; background: #f8fafc; border-radius: 8px; font-size: 12px; color: #64748b; text-align: center;">
          ⚡ Internal Team Alert — BRAND R.Comm 2026 System Notification
        </div>
      </div>
    </body>
    </html>
    `;

    await resend.emails.send({
      from: senderEmail,
      to: adminEmails,
      subject: subject,
      html: htmlContent,
    });

    console.log(`📩 Internal team notification (${dataDoc.paymentStatus}) sent to ${adminEmails.length} recipients: ${adminEmails.join(', ')}`);
  } catch (err) {
    console.error('⚠️ Error sending internal team notification email:', err.message);
  }
};

/**
 * Send award nomination registration & payment status update email via Resend
 * @param {Object} nomination - The nomination database object
 */
const sendNominationConfirmationEmail = async (nomination, rawToken = null) => {
  try {
    if (!nomination || !nomination.email) {
      console.error('Cannot send nomination email: Missing recipient email address.');
      return { success: false, error: 'Missing email' };
    }

    const resend = getResendInstance();
    if (!resend) {
      console.warn('Skipping email send: Resend client not configured.');
      return { success: false, error: 'Resend not configured' };
    }

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'BRAND R.Comm 2026 <onboarding@resend.dev>';
    const isPaid = nomination.paymentStatus === 'Paid';
    const isFailed = nomination.paymentStatus === 'Failed';

    let subject = `🏆 Award Nomination Received: BRAND R.Comm Awards 2026 (${nomination.fullName})`;
    let messageText = `Thank you for submitting your nomination for <strong>BRAND R.Comm Awards 2026</strong>! Your nomination details have been successfully saved with us.`;
    let statusBadge = `<span style="background: #fef08a; color: #854d0e; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Pending</span>`;

    if (isPaid) {
      subject = `✅ Nomination Payment Confirmed: BRAND R.Comm Awards 2026 (${nomination.fullName})`;
      messageText = `Great news! Your nomination entry fee for <strong>BRAND R.Comm Awards 2026</strong> has been successfully verified. Your nomination is now undergoing internal review for the Jury evaluation.`;
      statusBadge = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Paid</span>`;
    } else if (isFailed) {
      subject = `⚠️ Nomination Payment Failed: BRAND R.Comm Awards 2026 (${nomination.fullName})`;
      messageText = `Your nomination fee payment attempt for <strong>BRAND R.Comm Awards 2026</strong> could not be processed. Your nomination details remain saved as pending.`;
      statusBadge = `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Failed</span>`;
    }

    const formattedAmount = `₹${(nomination.amountPaid || nomination.totalAmount || 9440).toLocaleString('en-IN')}`;

    const tokenParam = rawToken ? `?nominationToken=${rawToken}` : '';
    const resumeUrl = `${process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app'}${tokenParam}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; color: #1a1a1a; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
        .header { background-color: #6a9a38; padding: 32px 24px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; }
        .header p { margin: 6px 0 0; font-size: 13px; opacity: 0.9; text-transform: uppercase; letter-spacing: 0.5px; }
        .content { padding: 32px 28px; }
        .greeting { font-size: 18px; font-weight: 700; color: #2d3748; margin-bottom: 12px; }
        .message { font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 24px; }
        .details-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 24px; }
        .details-card h3 { margin-top: 0; margin-bottom: 16px; font-size: 15px; color: #6a9a38; text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 2px solid #6a9a38; padding-bottom: 8px; display: inline-block; }
        .event-info { background: #1a202c; color: #ffffff; padding: 20px; border-radius: 12px; margin-bottom: 24px; text-align: center; }
        .event-info h4 { margin: 0 0 8px; font-size: 16px; color: #a3e635; text-transform: uppercase; }
        .event-info p { margin: 4px 0; font-size: 13px; color: #cbd5e1; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .footer a { color: #6a9a38; text-decoration: none; font-weight: 600; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BRAND R.Comm Awards 2026</h1>
          <p>5th Agriculture & Rural Communication Summit & Awards</p>
        </div>
        
        <div class="content">
          <div class="greeting">Dear ${nomination.fullName},</div>
          <div class="message">
            ${messageText}
          </div>

          <div class="details-card">
            <h3>Nomination Summary</h3>
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Nomination ID:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right; font-family: monospace;">${nomination._id}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Nominee Name:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right;">${nomination.fullName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Award Category:</td>
                <td style="padding: 6px 0; color: #6a9a38; font-size: 14px; font-weight: 700; text-align: right;">${nomination.awardCategory}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Organization:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${nomination.organization}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Designation:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${nomination.designation}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment Status:</td>
                <td style="padding: 6px 0; text-align: right;">${statusBadge}</td>
              </tr>
              ${nomination.razorpayPaymentId ? `
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment ID:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 13px; font-family: monospace; text-align: right;">${nomination.razorpayPaymentId}</td>
              </tr>
              ` : ''}
              ${nomination.amountPaid ? `
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Nomination Fee:</td>
                <td style="padding: 6px 0; color: #6a9a38; font-size: 15px; font-weight: 700; text-align: right;">${formattedAmount} (incl. 18% GST)</td>
              </tr>
              ` : ''}
            </table>
          </div>

          ${!isPaid ? `
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resumeUrl}" style="background-color: #6a9a38; color: #ffffff; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(106, 154, 56, 0.3);">
              Complete Your Payment →
            </a>
          </div>
          ` : ''}

          <div class="event-info">
            <h4>🏆 Awards Ceremony</h4>
            <p><strong>Date:</strong> Friday, 27th February 2026</p>
            <p><strong>Venue:</strong> Holiday Inn, Aerocity, New Delhi</p>
          </div>

          <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center;">
            Our jury screening panel will evaluate your entry and update you on further announcements.
          </p>
        </div>

        <div class="footer">
          <p>© 2026 BRAND R.Comm — Snail Integral. All rights reserved.</p>
          <p>For any queries, contact us at <a href="mailto:info@brandrcomm.com">info@brandrcomm.com</a></p>
        </div>
      </div>
    </body>
    </html>
    `;

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [nomination.email],
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.warn(`⚠️ Resend nomination email warning for ${nomination.email}: ${error.message}`);
      return { success: false, error: error.message };
    }

    console.log(`✉️ Award Nomination email (${nomination.paymentStatus}) sent successfully to ${nomination.email}`);
    // ── Send Internal Notification to Team Members (ADMIN_NOTIFICATION_EMAILS) ──
    sendAdminNotificationEmail('nomination', nomination).catch(err => console.error('Error sending team nomination notification:', err));

    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending nomination email via Resend:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendDelegateConfirmationEmail,
  sendNominationConfirmationEmail
};
