// backend/models/Project.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  images: [
    {
      type: String // store image URLs or paths
    }
  ],
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Ongoing", "Completed"],
    default: "Ongoing"
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("Project", ProjectSchema);
