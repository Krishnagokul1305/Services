const nodemailer = require('nodemailer');
const AppError = require('../utils/AppError');

class EmailService {
  constructor() {
    this.transporter = this.createTransporter();
  }

  createTransporter() {
    // For Gmail
    if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
      return nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS // This should be an app password, not your regular password
        }
      });
    }

    // For other email providers
    return nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail({ to, subject, text, html, from }) {
    try {
      const mailOptions = {
        from: from || process.env.EMAIL_FROM,
        to: to,
        subject: subject,
        text: text,
        html: html
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new AppError(`Failed to send email: ${error.message}`, 500);
    }
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      throw new AppError('Email service configuration error', 500);
    }
  }
}

module.exports = new EmailService();
