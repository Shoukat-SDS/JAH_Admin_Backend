import mongoose from "mongoose";
import Category from "../models/Category.js";
import slugify from "slugify";
import dotenv from "dotenv";

dotenv.config();

const categories = ["Sermons", "Blog", "News", "Events", "Announcements"];

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    for (let name of categories) {
      const exists = await Category.findOne({ name });
      if (!exists) {
        await Category.create({
          name,
          slug: slugify(name, { lower: true, strict: true })
        });
        console.log(`Category created: ${name}`);
      }
    }

    console.log("Seeding finished");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedCategories();
