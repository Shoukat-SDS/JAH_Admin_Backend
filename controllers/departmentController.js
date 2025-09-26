// backend/controllers/departmentController.js
import Department from "../models/Department.js";

// CREATE
export const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : undefined;

    // 1️⃣ Check required fields
    if (!name || !description) {
      return res.status(400).json({ success: false, message: "Name and description are required" });
    }

    // 2️⃣ Check duplicate by name
    const existingDept = await Department.findOne({ name });
    if (existingDept) {
      return res.status(400).json({ success: false, message: "Department with this name already exists" });
    }

    // 3️⃣ Create new department
    const dept = await Department.create({ name, description, image });

    res.status(201).json({ success: true, data: dept });
  } catch (error) {
    console.error("Error creating department:", error);

    // 4️⃣ Handle duplicate error from MongoDB just in case
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Department already exists" });
    }

    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET ALL
export const getDepartments = async (req, res) => {
  const depts = await Department.find();
  res.json(depts);
};

// GET SINGLE (DETAIL PAGE)
export const getDepartmentById = async (req, res) => {
  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: "Department not found" });
  res.json(dept);
};

// UPDATE
export const updateDepartment = async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.path : undefined;

  const dept = await Department.findById(req.params.id);
  if (!dept) return res.status(404).json({ message: "Department not found" });

  dept.name = name || dept.name;
  dept.description = description || dept.description;
  if (image) dept.image = image;
  dept.updatedAt = Date.now();

  await dept.save();
  res.json(dept);
};

// DELETE
export const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findById(req.params.id);
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Soft delete (just set flag instead of actual delete)
    dept.isDeleted = true;
    await dept.save();

    res.json({ message: "Department deleted successfully (soft delete)" });
  } catch (error) {
    console.error("Error in deleteDepartment:", error);
    res.status(500).json({ message: "Server error" });
  }
};