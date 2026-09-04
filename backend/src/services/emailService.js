const env = require('../config/env');
const logger = require('../utils/logger');

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // Nodemailer fallback
}

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    const smtpHost = process.env.SMTP_HOST || env.smtpHost;
    const smtpUser = process.env.SMTP_USER || env.smtpUser;
    const smtpPass = process.env.SMTP_PASSWORD || env.smtpPassword;

    if (nodemailer && smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false, // 587 uses STARTTLS
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        logger.info(`[EMAIL] Nodemailer SMTP Transporter initialized for ${smtpUser}`);
      } catch (err) {
        logger.warn(`[EMAIL ERROR] SMTP initialization warning: ${err.message}`);
        this.transporter = null;
      }
    }
  }

  async sendVerificationOTP({ email, otp, purpose = 'email_verification' }) {
    if (!this.transporter) {
      this.initTransporter();
    }

    const isPasswordReset = purpose === 'password_reset';
    const subject = isPasswordReset
      ? 'Reset your Capacity Connect password'
      : 'Verify your Capacity Connect account';

    const title = isPasswordReset ? 'Password Reset Code' : 'Verify Your Email';
    const description = isPasswordReset
      ? 'You requested to reset your password for your Capacity Connect account. Enter the 6-digit verification code below to proceed.'
      : 'Thank you for signing up with Capacity Connect. Enter the 6-digit verification code below to activate your learning portal account.';

    const textContent = `Capacity Connect - ${title}\n\n${description}\n\nVerification Code: ${otp}\n\nThis code will expire in 10 minutes. If you did not request this email, please ignore it.`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; text-align: center;">
          <div style="font-size: 20px; font-weight: 800; color: #06b6d4; letter-spacing: -0.5px; margin-bottom: 24px;">CAPACITY CONNECT</div>
          <div style="font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px;">${title}</div>
          <div style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px;">${description}</div>
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; background-color: #020617; border: 1px solid #0284c7; padding: 16px 24px; border-radius: 12px; display: inline-block; margin-bottom: 24px;">${otp}</div>
          <div style="font-size: 12px; color: #cbd5e1;">This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; padding-top: 16px;">
            &copy; 2026 Capacity Connect. Digital Capacity Building & Competency Portal.<br>
            If you did not request this email, please ignore it safely.
          </div>
        </div>
      </body>
      </html>
    `;

    if (this.transporter) {
      try {
        const smtpUser = process.env.SMTP_USER || env.smtpUser;
        const info = await this.transporter.sendMail({
          from: `"Capacity Connect" <${smtpUser}>`,
          replyTo: smtpUser,
          to: email,
          subject,
          text: textContent,
          html: htmlContent,
        });
        logger.info(`[EMAIL] Verification email sent to ${email} (MessageID: ${info.messageId})`);
        return { success: true, messageId: info.messageId };
      } catch (err) {
        logger.error(`[EMAIL ERROR] SMTP sendMail error to ${email}: ${err.message}`);
        console.error(`[EMAIL ERROR] SMTP sendMail error to ${email}: ${err.message}`);
        return { success: false, error: err.message };
      }
    }

    // Console logger fallback
    console.log(`[EMAIL SERVICE MOCK] To: ${email} | Subject: ${subject} | Code: ${otp}`);
    return { success: true, mock: true };
  }
}

module.exports = new EmailService();
