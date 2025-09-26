import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ""
  },
  tags: [
    {
      type: String
    }
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: false
  },
  published: {
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

export default mongoose.model("Blog", BlogSchema);
