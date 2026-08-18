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

const getEmailConfig = (doc, isNomination) => {
  const isPaid = doc.paymentStatus === 'Paid';
  const isFailed = doc.paymentStatus === 'Failed';
  const isPending = doc.paymentStatus === 'Pending';
  const isManuallyCreated = doc.isManuallyCreated;
  const paymentMethod = (doc.paymentMethod || 'Online').toLowerCase();

  let subject, messageText, statusBadge, showCTA, hideFinancials;

  const eventName = isNomination ? 'BRAND R.Comm Awards 2026' : 'BRAND R.Comm 2026';
  const passType = isNomination ? 'nomination entry' : 'delegate pass';

  if (isManuallyCreated && (isPaid || paymentMethod === 'cash' || paymentMethod === 'complimentary' || paymentMethod === 'free')) {
    // Case 4: Admin Registration + Cash/Complimentary/Paid/Free
    subject = `🎉 Registration Confirmed by Snail Integral Team`;
    messageText = `Your registration for <strong>${eventName}</strong> has been successfully processed by the Snail Integral team. We are excited to have you join us. Your ${passType} is fully confirmed!`;
    statusBadge = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">${paymentMethod === 'complimentary' || paymentMethod === 'free' ? 'Confirmed' : 'Paid'}</span>`;
    showCTA = false;
    hideFinancials = (paymentMethod === 'complimentary' || paymentMethod === 'free');
  } else if (isManuallyCreated && isPending && paymentMethod === 'online') {
    // Case 5: Admin Registration + Online/Pending
    subject = `⏳ Registration Created — Payment Required (${doc.fullName})`;
    messageText = `Your registration for <strong>${eventName}</strong> has been created by the Snail Integral team. To fully confirm your ${passType}, please complete your online payment securely using the link below.`;
    statusBadge = `<span style="background: #fef08a; color: #854d0e; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Pending</span>`;
    showCTA = true;
    hideFinancials = false;
  } else if (!isManuallyCreated && isPaid) {
    // Case 2: Website Registration + Paid
    subject = `✅ Payment Confirmed: ${eventName} (${doc.fullName})`;
    messageText = `Great news! Your payment for <strong>${eventName}</strong> has been successfully verified. Your ${passType} is fully confirmed!`;
    statusBadge = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Paid</span>`;
    showCTA = false;
    hideFinancials = false;
  } else if (!isManuallyCreated && isFailed) {
    // Case 3: Website Registration + Failed
    subject = `⚠️ Payment Failed: ${eventName} (${doc.fullName})`;
    messageText = `Your payment attempt for <strong>${eventName}</strong> could not be completed. Your registration details remain safely saved with us as pending. Please retry your payment to secure your pass.`;
    statusBadge = `<span style="background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Failed</span>`;
    showCTA = true;
    hideFinancials = false;
  } else if (doc.delegateType === 'foreign') {
    // Case: Foreign Delegate (No payment required immediately)
    subject = `✅ Registration Confirmed: ${eventName} (${doc.fullName})`;
    messageText = `Great news! Your registration for <strong>${eventName}</strong> has been securely received and confirmed. Our team will contact you shortly regarding international delegate details and visa-support.`;
    statusBadge = `<span style="background: #dcfce7; color: #15803d; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Confirmed</span>`;
    showCTA = false;
    hideFinancials = true;
  } else {
    // Case 1: Website Registration + Pending
    subject = `⏳ Complete Your Registration: ${eventName} (${doc.fullName})`;
    messageText = `Thank you for registering for <strong>${eventName}</strong>! Your details have been securely received. To confirm your ${passType}, please complete your online payment.`;
    statusBadge = `<span style="background: #fef08a; color: #854d0e; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; display: inline-block;">Pending</span>`;
    showCTA = true;
    hideFinancials = false;
  }

  return { subject, messageText, statusBadge, showCTA, hideFinancials };
};

const buildHtmlTemplate = (doc, isNomination, config, rawToken) => {
  const { subject, messageText, statusBadge, showCTA, hideFinancials } = config;
  
  const amountToFormat = doc.amountPaid || doc.totalAmount || (isNomination ? 9440 : 5664);
  const formattedAmount = (!isNomination && doc.delegateType === 'foreign') 
    ? `USD ${amountToFormat}` 
    : `₹${amountToFormat.toLocaleString('en-IN')}`;

  const tokenParam = rawToken ? `?${isNomination ? 'nominationToken' : 'token'}=${rawToken}` : '';
  const resumeUrl = `${process.env.FRONTEND_URL || 'https://brand-r-com-4.vercel.app'}/pay${tokenParam}`;

  const headerTitle = isNomination ? 'BRAND R.Comm Awards 2026' : 'BRAND R.Comm 2026';
  const headerSub = 'Agriculture & Rural Communication Summit & Awards';
  
  let financialRows = '';
  if (!hideFinancials) {
    if (doc.paymentMethod && doc.paymentMethod.toLowerCase() !== 'online' && doc.paymentMethod.toLowerCase() !== 'online (razorpay)') {
      financialRows += `
        <tr>
          <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment Method:</td>
          <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${doc.paymentMethod}</td>
        </tr>
      `;
    }
    
    if (doc.razorpayPaymentId) {
      financialRows += `
        <tr>
          <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment ID:</td>
          <td style="padding: 6px 0; color: #1a202c; font-size: 13px; font-family: monospace; text-align: right;">${doc.razorpayPaymentId}</td>
        </tr>
      `;
    }
    
    financialRows += `
      <tr>
        <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Amount ${doc.paymentStatus === 'Paid' ? 'Paid' : 'Due'}:</td>
        <td style="padding: 6px 0; color: #6a9a38; font-size: 15px; font-weight: 700; text-align: right;">${formattedAmount}</td>
      </tr>
    `;
  } else if (doc.paymentMethod && (doc.paymentMethod.toLowerCase() === 'complimentary' || doc.paymentMethod.toLowerCase() === 'free')) {
    financialRows += `
      <tr>
        <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment Method:</td>
        <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right; text-transform: capitalize;">${doc.paymentMethod}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Amount:</td>
        <td style="padding: 6px 0; color: #6a9a38; font-size: 15px; font-weight: 700; text-align: right;">Free</td>
      </tr>
    `;
  }

  let specificRows = '';
  if (isNomination) {
    specificRows = `
      <tr>
        <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Award Category:</td>
        <td style="padding: 6px 0; color: #6a9a38; font-size: 14px; font-weight: 700; text-align: right;">${doc.awardCategory || 'N/A'}</td>
      </tr>
    `;
  } else {
    specificRows = `
      <tr>
        <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Category:</td>
        <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${doc.attendeeCategory || 'DELEGATE'}</td>
      </tr>
    `;
  }

  return `
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
        <h1>${headerTitle}</h1>
        <p>${headerSub}</p>
      </div>
      
      <div class="content">
        <div class="greeting">Dear ${doc.fullName},</div>
        <div class="message">
          ${messageText}
        </div>

        <div class="details-card">
          <h3>Registration Details</h3>
          <table width="100%" style="border-collapse: collapse;">
            <tr>
              <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Registration ID:</td>
              <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right; font-family: monospace;">#${doc._id.toString().slice(-8).toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">${isNomination ? 'Nominee Name' : 'Full Name'}:</td>
              <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right;">${doc.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Organization:</td>
              <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${doc.organization}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Designation:</td>
              <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${doc.designation}</td>
            </tr>
            ${specificRows}
            <tr>
              <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Payment Status:</td>
              <td style="padding: 6px 0; text-align: right;">${statusBadge}</td>
            </tr>
            ${financialRows}
          </table>
        </div>

        ${showCTA ? `
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resumeUrl}" style="background-color: #6a9a38; color: #ffffff; padding: 14px 28px; font-size: 14px; font-weight: 700; border-radius: 8px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 0.5px; box-shadow: 0 4px 12px rgba(106, 154, 56, 0.3);">
            Complete Your Payment →
          </a>
        </div>
        ` : ''}

        <div class="event-info">
          <h4>${isNomination ? '🏆 Awards Ceremony' : '📅 Event Schedule & Venue'}</h4>
          <p><strong>Date:</strong> Friday, 4th December 2026</p>
          <p><strong>Venue:</strong> New Delhi, India</p>
        </div>

        <p style="font-size: 13px; color: #718096; line-height: 1.5; text-align: center;">
          ${isNomination ? 'Our jury screening panel will evaluate your entry and update you on further announcements.' : 'Please carry a copy of this email or your Registration ID on the day of the event for seamless check-in.'}
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
};

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

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Brandrcomm <noreply@brandrcomm.com>';
    const config = getEmailConfig(delegate, false);
    const htmlContent = buildHtmlTemplate(delegate, false, config, rawToken);

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [delegate.email],
      subject: config.subject,
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

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Brandrcomm <noreply@brandrcomm.com>';
    const config = getEmailConfig(nomination, true);
    const htmlContent = buildHtmlTemplate(nomination, true, config, rawToken);

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [nomination.email],
      subject: config.subject,
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

const sendSpeakerConfirmationEmail = async (doc) => {
  try {
    const resend = getResendInstance();
    if (!resend) return;

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Brandrcomm <noreply@brandrcomm.com>';
    const eventName = 'BRAND R.Comm 2026';
    const toEmail = doc.email.trim();

    const subject = `Thank You for Your Interest in Speaking at ${eventName}`;

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
          <p>Agriculture & Rural Communication Summit & Awards</p>
        </div>
        
        <div class="content">
          <div class="greeting">Dear ${doc.fullName},</div>
          <div class="message">
            Thank you for expressing your interest in speaking at <strong>${eventName}</strong>. We have successfully received your enquiry and your details have been shared with our organizing committee.
            Our team will review your profile and the proposed subject area, and we will get back to you shortly if there is a suitable speaking opportunity.
          </div>

          <div class="details-card">
            <h3>Enquiry Details</h3>
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Enquiry ID:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right; font-family: monospace;">#${doc._id ? doc._id.toString().slice(-8).toUpperCase() : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Organization:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${doc.organization || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Subject Area:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${doc.subjectArea || 'N/A'}</td>
              </tr>
            </table>
          </div>

          <div class="event-info">
            <h4>📅 Event Schedule & Venue</h4>
            <p><strong>Date:</strong> Friday, 4th December 2026</p>
            <p><strong>Venue:</strong> New Delhi, India</p>
          </div>
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
      to: [toEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending speaker confirmation email:', error);
      return;
    }
    console.log('Speaker confirmation email sent to:', toEmail);

    // Send internal team notification
    sendAdminNotificationEmail('speaker', doc).catch(err => console.error('Error sending team speaker notification:', err));

  } catch (err) {
    console.error('Exception sending speaker confirmation email:', err.message);
  }
};

const sendSponsorshipConfirmationEmail = async (doc) => {
  try {
    const resend = getResendInstance();
    if (!resend) return;

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Brandrcomm <noreply@brandrcomm.com>';
    const eventName = 'BRAND R.Comm 2026';
    const toEmail = doc.email.trim();

    const subject = `Sponsorship Booking Received: ${eventName}`;

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
          <p>Agriculture & Rural Communication Summit & Awards</p>
        </div>
        
        <div class="content">
          <div class="greeting">Dear ${doc.contactPerson},</div>
          <div class="message">
            Thank you for booking a sponsorship for <strong>${eventName}</strong> on behalf of <strong>${doc.companyName}</strong>. 
            We have securely received your details for the <strong>${doc.sponsorshipTier || doc.sponsorshipCategory || 'Sponsorship'}</strong> package. Our team will reach out to you shortly to process your booking and assist you with the next steps.
          </div>

          <div class="details-card">
            <h3>Booking Details</h3>
            <table width="100%" style="border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Booking ID:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right; font-family: monospace;">#${doc._id ? doc._id.toString().slice(-8).toUpperCase() : 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Company Name:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 700; text-align: right;">${doc.companyName}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #718096; font-size: 14px; font-weight: 600;">Sponsorship Tier:</td>
                <td style="padding: 6px 0; color: #1a202c; font-size: 14px; font-weight: 600; text-align: right;">${doc.sponsorshipTier || doc.sponsorshipCategory || 'N/A'}</td>
              </tr>
            </table>
          </div>

          <div class="event-info">
            <h4>📅 Event Schedule & Venue</h4>
            <p><strong>Date:</strong> Friday, 4th December 2026</p>
            <p><strong>Venue:</strong> New Delhi, India</p>
          </div>
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
      to: [toEmail],
      subject,
      html: htmlContent,
    });

    if (error) {
      console.error('Error sending sponsorship confirmation email:', error);
      return;
    }
    console.log('Sponsorship confirmation email sent to:', toEmail);

    // Send internal team notification
    sendAdminNotificationEmail('sponsorship', doc).catch(err => console.error('Error sending team sponsorship notification:', err));

  } catch (err) {
    console.error('Exception sending sponsorship confirmation email:', err.message);
  }
};

const sendAdminNotificationEmail = async (entityType, dataDoc) => {
  try {
    const adminEmails = (process.env.ADMIN_NOTIFICATION_EMAILS || "")
      .split(",")
      .map(e => e.trim())
      .filter(Boolean);

    if (adminEmails.length === 0) return;

    const resend = getResendInstance();
    if (!resend) return;

    const senderEmail = process.env.RESEND_FROM_EMAIL || 'Brandrcomm <noreply@brandrcomm.com>';
    const isPaid = dataDoc.paymentStatus === 'Paid';
    const isForeign = dataDoc.delegateType === 'foreign';
    const regId = dataDoc._id ? dataDoc._id.toString().slice(-8).toUpperCase() : 'N/A';
    const typeLabel = entityType === 'delegate' ? 'Delegate Registration' : (entityType === 'speaker' ? 'Speaker Enquiry' : (entityType === 'sponsorship' ? 'Sponsorship Booking' : 'Award Nomination'));
    const displayName = dataDoc.companyName || dataDoc.fullName || 'N/A';

    let subject = `🚨 [NEW REGISTRATION] ${typeLabel} #${regId} — ${displayName} (Pending)`;
    if (isPaid) subject = `💰 [PAYMENT RECEIVED] ${typeLabel} #${regId} — ${displayName}`;
    if (isForeign) subject = `🌐 [INTL DELEGATE] ${typeLabel} #${regId} — ${displayName}`;
    if (entityType === 'speaker') subject = `🎤 [NEW SPEAKER ENQUIRY] #${regId} — ${displayName}`;
    if (entityType === 'sponsorship') subject = `🏢 [NEW SPONSORSHIP] #${regId} — ${displayName}`;

    let headerColor = isPaid ? '#16a34a' : '#ea580c';
    if (isForeign) headerColor = '#2563eb';
    if (entityType === 'speaker') headerColor = '#9333ea';
    if (entityType === 'sponsorship') headerColor = '#0d9488';

    let badgeBg = isPaid ? '#dcfce7' : '#ffedd5';
    let badgeTextCol = isPaid ? '#15803d' : '#c2410c';
    let badgeText = isPaid ? 'Payment Confirmed' : 'Registration Pending';
    if (isForeign) {
      badgeBg = '#dbeafe';
      badgeTextCol = '#1d4ed8';
      badgeText = 'International Registration';
    }
    if (entityType === 'speaker') {
      badgeBg = '#f3e8ff';
      badgeTextCol = '#7e22ce';
      badgeText = 'Speaker Enquiry';
    }
    if (entityType === 'sponsorship') {
      badgeBg = '#ccfbf1';
      badgeTextCol = '#0f766e';
      badgeText = 'Sponsorship Booking';
    }

    const formattedAmount = isForeign
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
        .header { border-bottom: 2px solid ${headerColor}; padding-bottom: 12px; margin-bottom: 20px; }
        .badge { background: ${badgeBg}; color: ${badgeTextCol}; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table td { padding: 8px 0; border-bottom: 1px dashed #e2e8f0; font-size: 14px; }
        .label { color: #64748b; font-weight: 600; }
        .value { text-align: right; font-weight: 700; color: #0f172a; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <span class="badge">${badgeText}</span>
          <h2 style="margin: 10px 0 0; font-size: 20px; color: #0f172a;">${subject}</h2>
        </div>
        <p style="font-size: 14px; color: #475569; margin-bottom: 16px;">
          An update has occurred on <strong>BRAND R.Comm 2026</strong>. Here are the details for your team records:
        </p>
        <table class="table">
          ${entityType === 'sponsorship' ? `<tr><td class="label">Company Name:</td><td class="value">${dataDoc.companyName}</td></tr>` : ''}
          <tr><td class="label">${entityType === 'sponsorship' ? 'Contact Person' : 'Attendee Name'}:</td><td class="value">${entityType === 'sponsorship' ? dataDoc.contactPerson : dataDoc.fullName}</td></tr>
          <tr><td class="label">Registration ID:</td><td class="value" style="font-family: monospace;">#${regId}</td></tr>
          <tr><td class="label">Email Address:</td><td class="value"><a href="mailto:${dataDoc.email}">${dataDoc.email}</a></td></tr>
          <tr><td class="label">Mobile Number:</td><td class="value"><a href="tel:${dataDoc.mobileNumber}">${dataDoc.mobileNumber}</a></td></tr>
          ${entityType !== 'sponsorship' ? `<tr><td class="label">Organization:</td><td class="value">${dataDoc.organization || 'N/A'}</td></tr>` : ''}
          <tr><td class="label">Designation:</td><td class="value">${dataDoc.designation || 'N/A'}</td></tr>
          <tr><td class="label">City / State:</td><td class="value">${dataDoc.city ? `${dataDoc.city}, ${dataDoc.stateCountry}` : 'N/A'}</td></tr>
          ${entityType === 'sponsorship' ? `<tr><td class="label">Sponsorship Tier:</td><td class="value">${dataDoc.sponsorshipTier || dataDoc.sponsorshipCategory || 'N/A'}</td></tr>` : ''}
          ${entityType === 'speaker' ? `<tr><td class="label">Subject Area:</td><td class="value">${dataDoc.subjectArea || 'N/A'}</td></tr>` : ''}
          ${(entityType !== 'speaker' && entityType !== 'sponsorship') ? `<tr><td class="label">Payment Status:</td><td class="value" style="color: ${headerColor};">${isForeign ? 'N/A (Intl)' : dataDoc.paymentStatus}</td></tr>` : ''}
          ${entityType !== 'speaker' ? `<tr><td class="label">Amount ${isForeign ? 'Applicable' : (isPaid ? 'Paid' : 'Due')}:</td><td class="value">${formattedAmount}</td></tr>` : ''}
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

    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: adminEmails,
      subject: subject,
      html: htmlContent,
    });

    if (error) {
      console.error(`⚠️ Error from Resend when sending internal team notification:`, error);
      return;
    }

    console.log(`📩 Internal team notification (${dataDoc.paymentStatus}) sent to ${adminEmails.length} recipients: ${adminEmails.join(', ')}`);
  } catch (err) {
    console.error('⚠️ Exception sending internal team notification email:', err.message);
  }
};

module.exports = {
  sendDelegateConfirmationEmail,
  sendNominationConfirmationEmail,
  sendSpeakerConfirmationEmail,
  sendSponsorshipConfirmationEmail,
  sendAdminNotificationEmail
};
