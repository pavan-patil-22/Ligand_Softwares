import TeamMember from "../model/TeamMember.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_TEAM_MEMBERS = [
  
];

// Helper to seed team members if empty
const seedTeamIfEmpty = async () => {
  try {
    const count = await TeamMember.countDocuments();
    if (count === 0) {
      console.log("Seeding default team members into database...");
      await TeamMember.insertMany(DEFAULT_TEAM_MEMBERS);
      console.log("Default team members seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding team members error:", error);
  }
};

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
export const getTeamMembers = async (req, res) => {
  try {
    await seedTeamIfEmpty();
    // Sort: isExecutive descending (true first), then order ascending, then createdAt descending
    const team = await TeamMember.find().sort({ isExecutive: -1, order: 1, createdAt: -1 });
    res.status(200).json({ team });
  } catch (error) {
    console.error("Get Team Members Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private (Admin only)
export const createTeamMember = async (req, res) => {
  try {
    const { name, role, experience, image, socials, isExecutive, order } = req.body;

    if (!name || !role || !experience || !image) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const teamMember = await TeamMember.create({
      name,
      role,
      experience,
      image,
      socials: socials || { linkedin: "", twitter: "", github: "" },
      isExecutive: isExecutive === true || isExecutive === "true",
      order: order !== undefined ? Number(order) : 0,
    });

    res.status(201).json({
      message: "Team member created successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Create Team Member Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private (Admin only)
export const updateTeamMember = async (req, res) => {
  try {
    const { name, role, experience, image, socials, isExecutive, order } = req.body;
    const { id } = req.params;

    const teamMember = await TeamMember.findById(id);
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }

    if (name) teamMember.name = name;
    if (role) teamMember.role = role;
    if (experience) teamMember.experience = experience;
    if (image) teamMember.image = image;
    if (socials) {
      teamMember.socials = {
        linkedin: socials.linkedin !== undefined ? socials.linkedin : teamMember.socials.linkedin,
        twitter: socials.twitter !== undefined ? socials.twitter : teamMember.socials.twitter,
        github: socials.github !== undefined ? socials.github : teamMember.socials.github,
      };
    }
    if (isExecutive !== undefined) {
      teamMember.isExecutive = isExecutive === true || isExecutive === "true";
    }
    if (order !== undefined) {
      teamMember.order = Number(order);
    }

    await teamMember.save();

    res.status(200).json({
      message: "Team member updated successfully",
      teamMember,
    });
  } catch (error) {
    console.error("Update Team Member Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private (Admin only)
export const deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const teamMember = await TeamMember.findByIdAndDelete(id);
    if (!teamMember) {
      return res.status(404).json({ error: "Team member not found" });
    }

    res.status(200).json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Delete Team Member Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload team photo to Cloudinary
// @route   POST /api/team/upload
// @access  Private (Admin only)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading team avatar image to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "team",
    });

    res.status(200).json({
      message: "Team photo uploaded successfully",
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
