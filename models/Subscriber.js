// backend/models/Subscriber.js
import mongoose from "mongoose";
import validator from "validator";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: "Invalid email format",
      },
    },
    status: {
      type: String,
      enum: ["active", "banned"],
      default: "active",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    source: {
      type: String,
      default: "website",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
subscriberSchema.index({ email: 1 });
subscriberSchema.index({ status: 1 });
subscriberSchema.index({ subscribedAt: -1 });

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;