import nodemailer from 'nodemailer';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: Record<string, any>;
}

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Email templates
const getEmailTemplate = (template: string, data: Record<string, any>): { html: string; text: string } => {
  switch (template) {
    case 'email-verification':
      return {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to GameTrust!</h2>
            <p>Hi ${data.firstName},</p>
            <p>Thank you for signing up for GameTrust. Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.verificationUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${data.verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>Best regards,<br>The GameTrust Team</p>
          </div>
        `,
        text: `
          Welcome to GameTrust!
          
          Hi ${data.firstName},
          
          Thank you for signing up for GameTrust. Please verify your email address by visiting this link:
          ${data.verificationUrl}
          
          This link will expire in 24 hours.
          
          Best regards,
          The GameTrust Team
        `
      };

    case 'password-reset':
      return {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hi ${data.firstName},</p>
            <p>You requested to reset your password for your GameTrust account. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.resetUrl}" style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            </div>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all;">${data.resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The GameTrust Team</p>
          </div>
        `,
        text: `
          Password Reset Request
          
          Hi ${data.firstName},
          
          You requested to reset your password for your GameTrust account. Visit this link to reset it:
          ${data.resetUrl}
          
          This link will expire in 1 hour.
          
          If you didn't request this password reset, please ignore this email.
          
          Best regards,
          The GameTrust Team
        `
      };

    case 'order-confirmation':
      return {
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Order Confirmation</h2>
            <p>Hi ${data.firstName},</p>
            <p>Thank you for your order! Your order #${data.orderNumber} has been confirmed.</p>
            <div style="background-color: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <h3>Order Details:</h3>
              <p><strong>Order Number:</strong> ${data.orderNumber}</p>
              <p><strong>Total Amount:</strong> ₦${data.totalAmount}</p>
              <p><strong>Items:</strong> ${data.itemCount} item(s)</p>
            </div>
            <p>You can track your order status in your account dashboard.</p>
            <p>Best regards,<br>The GameTrust Team</p>
          </div>
        `,
        text: `
          Order Confirmation
          
          Hi ${data.firstName},
          
          Thank you for your order! Your order #${data.orderNumber} has been confirmed.
          
          Order Details:
          Order Number: ${data.orderNumber}
          Total Amount: ₦${data.totalAmount}
          Items: ${data.itemCount} item(s)
          
          You can track your order status in your account dashboard.
          
          Best regards,
          The GameTrust Team
        `
      };

    default:
      return {
        html: `<p>${data.message || 'No content available'}</p>`,
        text: data.message || 'No content available'
      };
  }
};

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const transporter = createTransporter();
    const { html, text } = getEmailTemplate(options.template, options.data);

    const mailOptions = {
      from: `"GameTrust" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      html,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${options.to}:`, result.messageId);
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

// Send bulk emails
export const sendBulkEmail = async (recipients: string[], options: Omit<EmailOptions, 'to'>): Promise<void> => {
  try {
    const promises = recipients.map(recipient => 
      sendEmail({ ...options, to: recipient })
    );
    
    await Promise.allSettled(promises);
    logger.info(`Bulk email sent to ${recipients.length} recipients`);
  } catch (error) {
    logger.error('Failed to send bulk email:', error);
    throw error;
  }
};