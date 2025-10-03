// models/DonationPayment.js
import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: {
      type: String,
      default: "Guest",
    },
    email: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["Zakat", "Sadqa", "Mosque Fund", "Other"],
      required: true,
    },
    donationType: {
      type: String,
      enum: ["One-Time", "Monthly", "Other"],
      default: "One-Time",
    },
    invoice: {
      type: String, // File path (JPEG proof)
    },
    paymentMethod: {
      type: String,
      enum: ["BankTransfer", "PayPro"],
      default: "BankTransfer",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Verified", "Failed"],
      default: "Pending",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);