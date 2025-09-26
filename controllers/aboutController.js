// backend/controllers/aboutController.js
import About from "../models/About.js";

// GET About info (public)
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      return res.json({
        intro: "",
        mission: "",
        vision: "",
        images: [],
      });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE About info (admin)
export const updateAbout = async (req, res) => {
  try {
    const { intro, mission, vision } = req.body;

    let about = await About.findOne();

    const images = req.files ? req.files.map((file) => file.path) : about?.images || [];

    if (about) {
      about.intro = intro || about.intro;
      about.mission = mission || about.mission;
      about.vision = vision || about.vision;
      about.images = images;
      about.updatedAt = Date.now();
      await about.save();
    } else {
      about = await About.create({
        intro,
        mission,
        vision,
        images,
      });
    }

    res.json(about);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
