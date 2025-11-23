import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify email configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service configuration error:', error);
  } else {
    console.log('✅ Email service is ready');
  }
});

// Send email verification
export const sendVerificationEmail = async (email, token, name) => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"EasySewa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your EasySewa Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to EasySewa!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for signing up with EasySewa. Please verify your email address to complete your registration.</p>
            <p style="text-align: center;">
              <a href="${verificationUrl}" class="button">Verify Email Address</a>
            </p>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #0ea5e9;">${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account with EasySewa, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EasySewa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error);
    return false;
  }
};

// Send approval email to bus owner
export const sendApprovalEmail = async (email, name, isApproved) => {
  const subject = isApproved 
    ? 'Your Bus Owner Account Has Been Approved! 🎉' 
    : 'Bus Owner Account Status Update';

  const content = isApproved
    ? `
      <p>Hi ${name},</p>
      <p>Great news! Your bus owner account has been approved by our admin team.</p>
      <p>You can now:</p>
      <ul>
        <li>Add your buses to the platform</li>
        <li>Create schedules for your routes</li>
        <li>Manage bookings and view analytics</li>
      </ul>
      <p style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/owner/dashboard" class="button">Go to Dashboard</a>
      </p>
    `
    : `
      <p>Hi ${name},</p>
      <p>We're currently reviewing your bus owner application. We'll notify you once the review is complete.</p>
      <p>Thank you for your patience.</p>
    `;

  const mailOptions = {
    from: `"EasySewa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          ul { padding-left: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${isApproved ? 'Account Approved!' : 'Application Under Review'}</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EasySewa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending approval email:', error);
    return false;
  }
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  const mailOptions = {
    from: `"EasySewa" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Your EasySewa Verification Code',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #0ea5e9, #f97316); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 2px solid #0ea5e9; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px; }
          .otp-code { font-size: 32px; font-weight: bold; color: #0ea5e9; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Verification Code</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Your verification code is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
            </div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} EasySewa. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return false;
  }
};

