// backend/models/Contact.js
import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String, required: true, unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "Invalid email"]
  },
  subject: { type: String },
  message: { type: String, required: true },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  adminReply: {
    type: String,
    default: null
  }
}, { timestamps: true })

export default mongoose.model('Message', messageSchema);
