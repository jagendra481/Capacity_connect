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
    const smtpHost = env.smtpHost;
    const smtpPort = env.smtpPort;
    const smtpUser = env.smtpUser;
    const smtpPass = env.smtpPassword;

    if (nodemailer && smtpHost && smtpUser && smtpPass) {
      try {
        this.transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: false, // 587 uses STARTTLS
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        logger.info(`[EMAIL] SMTP Transporter initialized for ${smtpUser}`);
      } catch (err) {
        logger.error(`[EMAIL ERROR] SMTP initialization failed: ${err.message}`);
        this.transporter = null;
      }
    } else {
      logger.warn('[EMAIL] SMTP environment credentials missing or incomplete.');
    }
  }

  async sendVerificationOTP({ email, otp, purpose = 'email_verification' }) {
    logger.info(`[EMAIL] Preparing verification email for recipient: ${email}`);

    if (!this.transporter) {
      this.initTransporter();
    }

    const isPasswordReset = purpose === 'password_reset';
    const subject = isPasswordReset
      ? 'CAPACITY CONNECT - Password Reset Code'
      : 'CAPACITY CONNECT - Verify Your Email Address';

    const title = isPasswordReset ? 'Password Reset Request' : 'Verify Your Email';
    const description = isPasswordReset
      ? 'You requested to reset your password for your Capacity Connect account. Enter the 6-digit verification code below to proceed.'
      : 'Thank you for registering with Capacity Connect. Please enter the 6-digit verification code below to activate your account.';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 20px; }
          .container { max-width: 520px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; padding: 32px; text-align: center; }
          .logo { font-size: 20px; font-weight: 800; color: #06b6d4; letter-spacing: -0.5px; margin-bottom: 24px; display: inline-block; }
          .title { font-size: 22px; font-weight: 700; color: #ffffff; margin-bottom: 12px; }
          .text { font-size: 14px; color: #94a3b8; line-height: 1.6; margin-bottom: 28px; }
          .otp-box { font-family: 'Courier New', Courier, monospace; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; background-color: #020617; border: 1px solid #0284c7; padding: 16px 24px; border-radius: 12px; display: inline-block; margin-bottom: 24px; }
          .footer { font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #1e293b; pt: 16px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">CAPACITY CONNECT</div>
          <div class="title">${title}</div>
          <div class="text">${description}</div>
          <div class="otp-box">${otp}</div>
          <div class="text" style="font-size: 12px; color: #cbd5e1;">This code will expire in <strong>10 minutes</strong>. Do not share this code with anyone.</div>
          <div class="footer">
            &copy; 2026 CAPACITY CONNECT. Digital Capacity Building & Competency Portal.<br>
            If you did not request this email, please ignore it.
          </div>
        </div>
      </body>
      </html>
    `;

    if (this.transporter) {
      try {
        logger.info('[EMAIL] SMTP connection established. Sending verification email...');
        const info = await this.transporter.sendMail({
          from: `"Capacity Connect" <${env.smtpUser}>`,
          to: email,
          subject,
          html: htmlContent,
        });

        logger.info(`[EMAIL] Email provider accepted message (MessageID: ${info.messageId})`);
        return {
          success: true,
          messageId: info.messageId,
        };
      } catch (err) {
        logger.error(`[EMAIL ERROR] SMTP sendMail failed for recipient ${email}: ${err.message}`);
        return {
          success: false,
          error: err.message,
        };
      }
    }

    logger.warn('[EMAIL ERROR] SMTP Transporter not available.');
    return {
      success: false,
      error: 'SMTP Transporter not configured.',
    };
  }

  async sendPasswordResetOTP(email, otp) {
    return this.sendVerificationOTP({ email, otp, purpose: 'password_reset' });
  }
}

module.exports = new EmailService();
