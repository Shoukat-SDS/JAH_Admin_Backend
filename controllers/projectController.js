// backend/controllers/projectController.js
import Project from "../models/Project.js";

// CREATE
export const createProject = async (req, res) => {
  const { title, description, category, status, featured } = req.body;
  const images = req.files ? req.files.map(file => file.path) : [];

  const project = await Project.create({ title, description, category, status, featured, images });
  res.status(201).json(project);
};

// GET ALL
export const getProjects = async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
};

// GET FEATURED (Home Page)
export const getFeaturedProjects = async (req, res) => {
  const projects = await Project.find({ featured: true });
  res.json(projects);
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  res.json(project);
};

// UPDATE
export const updateProject = async (req, res) => {
  const { title, description, category, status, featured } = req.body;
  const images = req.files ? req.files.map(file => file.path) : undefined;

  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });

  project.title = title || project.title;
  project.description = description || project.description;
  project.category = category || project.category;
  project.status = status || project.status;
  if (images) project.images = images;
  project.featured = featured !== undefined ? featured : project.featured;
  project.updatedAt = Date.now();

  await project.save();
  res.json(project);
};

// DELETE
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // soft delete instead of remove
    project.isDeleted = true;
    await project.save();

    res.json({ message: "Project deleted successfully (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};