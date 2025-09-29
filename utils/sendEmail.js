// import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';
// dotenv.config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   secure: process.env.EMAIL_PORT === '465', // SSL ke liye 465
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// export const sendEmail = async (options) => {
//   try {
//     const mailOptions = {
//       from: process.env.EMAIL_FROM,
//       to: options.email,
//       subject: options.subject,
//       html: options.html
//     };

//     const info = await transporter.sendMail(mailOptions);
//     return info;
//   } catch (error) {
//     console.error('Email send error:', error);
//     throw new Error('Email could not be sent');
//   }
// };

// export const emailTemplates = {
//   welcome: (name) => ({
//     subject: 'Welcome to Jamat Panel',
//     html: `
//       <h1>Welcome ${name}!</h1>
//       <p>Thank you for joining Jamat Panel. We're excited to have you on board.</p>
//     `
//   }),

//   resetPassword: (resetUrl) => ({
//     subject: 'Password Reset Request',
//     html: `
//       <h1>Password Reset Request</h1>
//       <p>You requested a password reset. Click the link below to reset your password:</p>
//       <a href="${resetUrl}">Reset Password</a>
//       <p>This link will expire in 30 minutes.</p>
//       <p>If you didn't request this, please ignore this email.</p>
//     `
//   }),

//   passwordChanged: () => ({
//     subject: 'Password Changed Successfully',
//     html: `
//       <h1>Password Changed</h1>
//       <p>Your password has been changed successfully.</p>
//       <p>If you didn't make this change, please contact us immediately.</p>
//     `
//   })
// };
// backend/utils/sendEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // SSL ke liye 465
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (options) => {
    try {
        console.log("=== 📧 Email Debug Start ===");
        console.log("From:", process.env.EMAIL_FROM);
        console.log("To:", options?.email);
        console.log("Subject:", options?.subject);
        console.log("HTML:", options?.html?.substring(0, 100) + "..."); // sirf 100 chars dikhaye

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: options.email,
            subject: options.subject,
            html: options.html
        };

        console.log("Mail Options Final:", mailOptions);

        const info = await transporter.sendMail(mailOptions);

        console.log("📨 Email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
        console.log("=== 📧 Email Debug End ===");

        return info;
    } catch (error) {
        console.error("❌ Email send error:", error);
        console.log("Options passed to sendEmail:", options);
        throw new Error("Email could not be sent");
    }
};

export const emailTemplates = {
    welcome: (name) => ({
        subject: 'Welcome to Jamat Panel',
        html: `
      <h1>Welcome ${name}!</h1>
      <p>Thank you for joining Jamat Panel. We're excited to have you on board.</p>
    `
    }),

    resetPassword: (resetUrl) => ({
        subject: 'Password Reset Request',
        html: `
      <h1>Password Reset Request</h1>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 30 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
    }),

    passwordChanged: () => ({
        subject: 'Password Changed Successfully',
        html: `
      <h1>Password Changed</h1>
      <p>Your password has been changed successfully.</p>
      <p>If you didn't make this change, please contact us immediately.</p>
    `
    })
};
