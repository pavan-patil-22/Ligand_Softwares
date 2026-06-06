import Project from "../model/Project.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_PROJECTS = [
  
];

// Helper to seed projects if empty
const seedProjectsIfEmpty = async () => {
  try {
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log("Seeding default projects into database...");
      await Project.insertMany(DEFAULT_PROJECTS);
      console.log("Default projects seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding projects error:", error);
  }
};

// @desc    Get all client projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    await seedProjectsIfEmpty();
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ projects });
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a client project
// @route   POST /api/projects
// @access  Private (Admin only)
export const createProject = async (req, res) => {
  try {
    const { name, desc, image, link } = req.body;

    if (!name || !desc || !image || !link) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const project = await Project.create({
      name,
      desc,
      image,
      link,
    });

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a client project
// @route   PUT /api/projects/:id
// @access  Private (Admin only)
export const updateProject = async (req, res) => {
  try {
    const { name, desc, image, link } = req.body;
    const { id } = req.params;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    if (name) project.name = name;
    if (desc) project.desc = desc;
    if (image) project.image = image;
    if (link) project.link = link;

    await project.save();

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a client project
// @route   DELETE /api/projects/:id
// @access  Private (Admin only)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload an image to Cloudinary (Base64 data)
// @route   POST /api/projects/upload
// @access  Private (Admin only)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string (data:image/png;base64,...)
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading image to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "projects",
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
