import Blog from "../models/Blog.js";
import Category from "../models/Category.js";
import slugify from "slugify";
import crypto from "crypto";

// CREATE
export const createBlog = async (req, res) => {
  try {
    const { title, content, tags, category, published } = req.body;

    // ✅ Unique slug
    const baseSlug = slugify(title, { lower: true, strict: true });
    const uniqueSuffix = crypto.randomBytes(3).toString("hex"); 
    const slug = `${baseSlug}-${uniqueSuffix}`;

    const thumbnail = req.file ? req.file.path : "";

    // ✅ Handle tags
    let tagsArray = [];
    if (tags) {
      if (typeof tags === "string") {
        tagsArray = tags.split(",").map(tag => tag.trim());
      } else if (Array.isArray(tags)) {
        tagsArray = tags;
      }
    }

    const blog = await Blog.create({
      title,
      slug,
      content,
      tags: tagsArray,
      category,
      thumbnail,
      published
    });

    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error("Error creating blog:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET ALL (Public vs Admin)
// export const getBlogs = async (req, res) => {
//   const filter = req.user && req.user.role === "superAdmin" ? {} : { published: false };
//   const blogs = await Blog.find(filter).populate("category");
//   res.json(blogs);
// };

export const getBlogs = async (req, res) => {
  try {
    let filter = {};

    // Agar user exist karta hai aur role superAdmin hai → sab blogs dikhenge
    if (!req.user || req.user.role !== "superAdmin") {
      filter = { published: true }; // public user ke liye sirf published blogs
    }

    const blogs = await Blog.find(filter)
      .populate("category")
      .sort({ createdAt: -1 }); // optional: newest first

    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET SINGLE BLOG BY SLUG
export const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({ slug: req.params.slug, published: true }).populate("category");
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
};

// UPDATE
export const updateBlog = async (req, res) => {
  const { title, content, tags, category, published } = req.body;
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  if (title) {
    blog.title = title;
    blog.slug = slugify(title, { lower: true, strict: true });
  }
  if (content) blog.content = content;
  if (tags) blog.tags = tags.split(",");
  if (category) blog.category = category;
  if (typeof published !== "undefined") blog.published = published;
  if (req.file) blog.thumbnail = req.file.path;

  blog.updatedAt = Date.now();
  await blog.save();

  res.json(blog);
};

// DELETE
export const deleteBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  await blog.remove();
  res.json({ message: "Blog deleted successfully" });
};

// CATEGORY CRUD
export const createCategory = async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true, strict: true });

  const category = await Category.create({ name, slug });
  res.status(201).json(category);
};

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};
