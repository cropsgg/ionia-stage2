import nodemailer from "nodemailer";

/**
 * Email Service
 * Handles sending emails to users for various system events
 */

// Create nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
  port: process.env.EMAIL_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send email verification to a new user
export const sendVerificationEmail = async (email, token, schoolName = null) => {
  try {
    // Create verification URL (frontend will handle the token)
    const verificationUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/verify-email?token=${token}`;
    
    // Create email content with conditional school name
    const schoolText = schoolName ? ` for ${schoolName}` : "";

    const info = await transporter.sendMail({
      from: `"Ionia Education" <${process.env.EMAIL_FROM || "noreply@ionia.sbs"}>`,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Ionia${schoolText}!</h2>
          <p>Please verify your email address by clicking the button below:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If the button doesn't work, you can also use this link: <a href="${verificationUrl}">${verificationUrl}</a></p>
          <p>This link will expire in 24 hours.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <hr style="margin: 30px 0;" />
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Ionia Education. All rights reserved.</p>
        </div>
      `,
    });

    console.log("Verification email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending verification email:", error);
    return false;
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, token, schoolName = null) => {
  try {
    // Create reset URL (frontend will handle the token)
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;
    
    // Create email content with conditional school name
    const schoolText = schoolName ? ` for ${schoolName}` : "";

    const info = await transporter.sendMail({
      from: `"Ionia Education" <${process.env.EMAIL_FROM || "noreply@ionia.sbs"}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Reset Your Password${schoolText}</h2>
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If the button doesn't work, you can also use this link: <a href="${resetUrl}">${resetUrl}</a></p>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request a password reset, you can safely ignore this email.</p>
          <hr style="margin: 30px 0;" />
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Ionia Education. All rights reserved.</p>
        </div>
      `,
    });

    console.log("Password reset email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    return false;
  }
};

// Send welcome email to new school admin
export const sendSchoolAdminWelcomeEmail = async (email, schoolName, username, password) => {
  try {
    // Create login URL
    const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/auth/login`;

    const info = await transporter.sendMail({
      from: `"Ionia Education" <${process.env.EMAIL_FROM || "noreply@ionia.sbs"}>`,
      to: email,
      subject: `Welcome to Ionia - School Admin for ${schoolName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Ionia Education Platform!</h2>
          <p>Your school <strong>${schoolName}</strong> has been successfully registered in the Ionia Education Platform.</p>
          <p>As the School Administrator, you can now log in to manage your school's classes, subjects, teachers, and students.</p>
          <p><strong>Your login credentials:</strong></p>
          <ul>
            <li><strong>Username:</strong> ${username}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>For security reasons, please change your password after your first login.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Log In Now</a>
          </div>
          <p>If the button doesn't work, you can also use this link: <a href="${loginUrl}">${loginUrl}</a></p>
          <hr style="margin: 30px 0;" />
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Ionia Education. All rights reserved.</p>
        </div>
      `,
    });

    console.log("School admin welcome email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending school admin welcome email:", error);
    return false;
  }
};

// Test email configuration
export const testEmailConfiguration = async () => {
  try {
    const info = await transporter.sendMail({
      from: `"Ionia Education" <${process.env.EMAIL_FROM || "noreply@ionia.sbs"}>`,
      to: process.env.TEST_EMAIL || "test@example.com",
      subject: "Email Configuration Test",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Configuration Test</h2>
          <p>This is a test email to verify that the email service is configured correctly.</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `,
    });

    console.log("Test email sent: %s", info.messageId);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error testing email configuration:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}; 