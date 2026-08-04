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
const sendDelegateConfirmationEmail = async (delegate) => {
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
      ? `USD ${delegate.amountPaid || 0}` 
      : `₹${(delegate.amountPaid || 0).toLocaleString('en-IN')}`;

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
    return { success: true, data };
  } catch (error) {
    console.error('❌ Error sending delegate email via Resend:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Send award nomination registration & payment status update email via Resend
 * @param {Object} nomination - The nomination database object
 */
const sendNominationConfirmationEmail = async (nomination) => {
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

    const formattedAmount = `₹${(nomination.amountPaid || 9440).toLocaleString('en-IN')}`;

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
