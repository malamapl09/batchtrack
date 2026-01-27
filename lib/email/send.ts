/**
 * Email Sending Utility
 * Wrapper around Resend API for sending transactional emails
 * Requires RESEND_API_KEY env variable
 */

import { Resend } from 'resend';
import { WelcomeEmail } from './templates/welcome';
import { LowStockAlertEmail } from './templates/low-stock-alert';

// Lazy initialization of Resend client
let resendClient: Resend | null = null;

function getResend(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(apiKey);
  }
  return resendClient;
}

// Default sender - update with your verified domain
const DEFAULT_FROM = 'BatchTrack <noreply@batchtrack.com>';

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(params: {
  to: string;
  userName?: string;
}) {
  const { to, userName } = params;

  try {
    const { data, error } = await getResend().emails.send({
      from: DEFAULT_FROM,
      to,
      subject: 'Welcome to BatchTrack!',
      react: WelcomeEmail({ userName }),
    });

    if (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending welcome email:', err);
    return { success: false, error: err };
  }
}

/**
 * Send a low stock alert email
 */
export async function sendLowStockAlert(params: {
  to: string;
  userName?: string;
  items: Array<{
    name: string;
    currentStock: number;
    threshold: number;
    unit: string;
  }>;
}) {
  const { to, userName, items } = params;

  if (items.length === 0) {
    return { success: false, error: 'No items to alert about' };
  }

  try {
    const { data, error } = await getResend().emails.send({
      from: DEFAULT_FROM,
      to,
      subject: `Low Stock Alert: ${items.length} item${items.length !== 1 ? 's' : ''} need reordering`,
      react: LowStockAlertEmail({ userName, items }),
    });

    if (error) {
      console.error('Failed to send low stock alert:', error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending low stock alert:', err);
    return { success: false, error: err };
  }
}

/**
 * Send a generic email with custom React template
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  react: React.ReactElement;
  from?: string;
}) {
  const { to, subject, react, from = DEFAULT_FROM } = params;

  try {
    const { data, error } = await getResend().emails.send({
      from,
      to,
      subject,
      react,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error('Error sending email:', err);
    return { success: false, error: err };
  }
}
