const logger = require('../utils/logger');

let nodemailer = null;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  // Nodemailer is optional; fallback console logger will handle emails
}

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  initTransporter() {
    if (nodemailer && process.env.SMTP_HOST && process.env.SMTP_USER) {
      try {
        this.transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: process.env.SMTP_PORT === '465',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
        logger.info('Nodemailer SMTP Transporter initialized.');
      } catch (err) {
        logger.warn(`SMTP initialization warning: ${err.message}`);
        this.transporter = null;
      }
    }
  }

  async sendVerificationOTP({ email, otp, purpose = 'email_verification' }) {
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
        await this.transporter.sendMail({
          from: `"Capacity Connect" <${process.env.SMTP_USER}>`,
          to: email,
          subject,
          html: htmlContent,
        });
        logger.info(`Verification email sent successfully to ${email}`);
        return true;
      } catch (err) {
        logger.error(`SMTP sendMail error to ${email}: ${err.message}`);
      }
    }

    // Console logger fallback when SMTP is not configured or in local development
    console.log(`\n======================================================`);
    console.log(`[EMAIL SERVICE MOCK] To: ${email} | Subject: ${subject}`);
    console.log(`[EMAIL SERVICE MOCK] 6-Digit OTP Code: >>> ${otp} <<<`);
    console.log(`======================================================\n`);
    return true;
  }
}

module.exports = new EmailService();
