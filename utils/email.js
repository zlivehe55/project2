const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const templates = {
  verification: (name, verificationUrl) => ({
    subject: 'Verify Your CraftyCrib Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #00ff88, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .card { background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; }
          h1 { color: #ffffff; margin: 0 0 20px; font-size: 24px; }
          p { color: #a0a0a0; line-height: 1.6; margin: 0 0 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏠 CraftyCrib</div>
          </div>
          <div class="card">
            <h1>Welcome, ${name}! 🎉</h1>
            <p>Thank you for joining CraftyCrib. You're one step away from transforming your living spaces with AI-powered design.</p>
            <p>Click the button below to verify your email address:</p>
            <center>
              <a href="${verificationUrl}" class="button">Verify Email</a>
            </center>
            <p>This link expires in 24 hours. If you didn't create this account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CraftyCrib. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  resetPassword: (name, resetUrl) => ({
    subject: 'Reset Your CraftyCrib Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #00ff88, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .card { background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; }
          h1 { color: #ffffff; margin: 0 0 20px; font-size: 24px; }
          p { color: #a0a0a0; line-height: 1.6; margin: 0 0 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #ff6b6b, #ff8e53); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏠 CraftyCrib</div>
          </div>
          <div class="card">
            <h1>Password Reset Request</h1>
            <p>Hi ${name},</p>
            <p>We received a request to reset your password. Click the button below to create a new password:</p>
            <center>
              <a href="${resetUrl}" class="button">Reset Password</a>
            </center>
            <p>This link expires in 1 hour. If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CraftyCrib. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  projectNotification: (name, projectTitle, message) => ({
    subject: `Update on Your Project: ${projectTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; background: #0a0a0f; color: #ffffff; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
          .header { text-align: center; margin-bottom: 40px; }
          .logo { font-size: 32px; font-weight: bold; background: linear-gradient(135deg, #00ff88, #00d4ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
          .card { background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 40px; }
          h1 { color: #ffffff; margin: 0 0 20px; font-size: 24px; }
          p { color: #a0a0a0; line-height: 1.6; margin: 0 0 20px; }
          .button { display: inline-block; background: linear-gradient(135deg, #00ff88, #00d4ff); color: #000000; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 40px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏠 CraftyCrib</div>
          </div>
          <div class="card">
            <h1>Project Update</h1>
            <p>Hi ${name},</p>
            <p>${message}</p>
            <center>
              <a href="${process.env.APP_URL}/dashboard" class="button">View Project</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} CraftyCrib. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send email function
const sendEmail = async (to, template, data) => {
  try {
    const emailContent = templates[template](...data);
    
    await transporter.sendMail({
      from: `"CraftyCrib" <${process.env.EMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    });
    
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email error:', error);
    return false;
  }
};

module.exports = { sendEmail, transporter };

