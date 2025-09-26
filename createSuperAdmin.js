import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import crypto from 'crypto';
import { sendEmail } from './utils/sendEmail.js';

dotenv.config();

console.log(process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const existingAdmin = await User.findOne({ role: 'superAdmin' });
    if (existingAdmin) {
      console.log('SuperAdmin already exists');
      process.exit();
    }

    // generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const admin = new User({
      name: "Super Admin",
      email: 'admin@softdesksolution.com',
      password: 'SDS@12345',
      role: 'superAdmin',
      verificationToken,
      verificationTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes
      isVerified: false
    });

    await admin.save();

    // verification link
    const verifyUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    // ✅ send verification email correctly
    await sendEmail({
      email: admin.email,
      subject: "Verify your SuperAdmin account",
      html: `<p>Welcome SuperAdmin! Please verify your account:</p>
             <a href="${verifyUrl}">Verify Email</a>`
    });

    console.log('SuperAdmin created & verification email sent');
    process.exit(0);
  })
  .catch(err => console.log(err));
