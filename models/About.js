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
  images: [
    {
      type: String, // store image URLs or file paths
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("About", AboutSchema);
