// backend/models/About.js
import mongoose from "mongoose";

const AboutSchema = new mongoose.Schema({
  intro: {
    type: String,
    required: true,
  },
  mission: {
    type: String,
  },
  vision: {
    type: String,
  },
  images: {
    large: { type: String },   // one large image
    small1: { type: String },  // first small image
    small2: { type: String },  // second small image
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("About", AboutSchema);
