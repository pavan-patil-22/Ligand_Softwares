import Testimonial from "../model/Testimonial.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_TESTIMONIALS = [
  
];

// Helper to seed testimonials if empty
const seedTestimonialsIfEmpty = async () => {
  try {
    const count = await Testimonial.countDocuments();
    if (count === 0) {
      console.log("Seeding default testimonials into database...");
      await Testimonial.insertMany(DEFAULT_TESTIMONIALS);
      console.log("Default testimonials seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding testimonials error:", error);
  }
};

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
export const getTestimonials = async (req, res) => {
  try {
    await seedTestimonialsIfEmpty();
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({ testimonials });
  } catch (error) {
    console.error("Get Testimonials Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private (Admin only)
export const createTestimonial = async (req, res) => {
  try {
    const { name, role, desc, image, rating } = req.body;

    if (!name || !role || !desc || !image) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const parsedRating = rating !== undefined ? Number(rating) : 5;

    const testimonial = await Testimonial.create({
      name,
      role,
      desc,
      image,
      rating: parsedRating,
    });

    res.status(201).json({
      message: "Testimonial created successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Create Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a testimonial
// @route   PUT /api/testimonials/:id
// @access  Private (Admin only)
export const updateTestimonial = async (req, res) => {
  try {
    const { name, role, desc, image, rating } = req.body;
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    if (name) testimonial.name = name;
    if (role) testimonial.role = role;
    if (desc) testimonial.desc = desc;
    if (image) testimonial.image = image;
    if (rating !== undefined) testimonial.rating = Number(rating);

    await testimonial.save();

    res.status(200).json({
      message: "Testimonial updated successfully",
      testimonial,
    });
  } catch (error) {
    console.error("Update Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin only)
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ error: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Delete Testimonial Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload client avatar to Cloudinary
// @route   POST /api/testimonials/upload
// @access  Private (Admin only)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string (data:image/png;base64,...)
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading avatar image to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "testimonials",
    });

    res.status(200).json({
      message: "Avatar uploaded successfully",
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
