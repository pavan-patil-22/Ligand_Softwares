import GalleryItem from "../model/GalleryItem.js";
import cloudinary from "../cloudinary.js";

const DEFAULT_GALLERY_ITEMS = [
 
];

// Helper to seed gallery categories if empty
const seedGalleryIfEmpty = async () => {
  try {
    const count = await GalleryItem.countDocuments();
    if (count === 0) {
      console.log("Seeding default gallery categories into database...");
      await GalleryItem.insertMany(DEFAULT_GALLERY_ITEMS);
      console.log("Default gallery categories seeded successfully.");
    }
  } catch (error) {
    console.error("Auto-seeding gallery error:", error);
  }
};

// @desc    Get all gallery categories
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
  try {
    await seedGalleryIfEmpty();
    const gallery = await GalleryItem.find().sort({ createdAt: -1 });
    res.status(200).json({ gallery });
  } catch (error) {
    console.error("Get Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Create a gallery category
// @route   POST /api/gallery
// @access  Private (Admin only)
export const createGalleryItem = async (req, res) => {
  try {
    const { title, desc, date, coverImage, images } = req.body;

    if (!title || !desc || !date || !coverImage) {
      return res.status(400).json({ error: "Please enter all required fields" });
    }

    const galleryItem = await GalleryItem.create({
      title,
      desc,
      date,
      coverImage,
      images: images || [],
    });

    res.status(201).json({
      message: "Gallery category created successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Create Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Update a gallery category
// @route   PUT /api/gallery/:id
// @access  Private (Admin only)
export const updateGalleryItem = async (req, res) => {
  try {
    const { title, desc, date, coverImage, images } = req.body;
    const { id } = req.params;

    const galleryItem = await GalleryItem.findById(id);
    if (!galleryItem) {
      return res.status(404).json({ error: "Gallery category not found" });
    }

    if (title) galleryItem.title = title;
    if (desc) galleryItem.desc = desc;
    if (date) galleryItem.date = date;
    if (coverImage) galleryItem.coverImage = coverImage;
    if (images) galleryItem.images = images;

    await galleryItem.save();

    res.status(200).json({
      message: "Gallery category updated successfully",
      galleryItem,
    });
  } catch (error) {
    console.error("Update Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Delete a gallery category
// @route   DELETE /api/gallery/:id
// @access  Private (Admin only)
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;

    const galleryItem = await GalleryItem.findByIdAndDelete(id);
    if (!galleryItem) {
      return res.status(404).json({ error: "Gallery category not found" });
    }

    res.status(200).json({ message: "Gallery category deleted successfully" });
  } catch (error) {
    console.error("Delete Gallery Error:", error);
    res.status(500).json({ error: error.message || "Server Error" });
  }
};

// @desc    Upload gallery photo to Cloudinary
// @route   POST /api/gallery/upload
// @access  Private (Admin only)
export const uploadImage = async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string
    if (!image) {
      return res.status(400).json({ error: "No image data provided" });
    }

    console.log("Uploading gallery photo to Cloudinary...");
    const uploadRes = await cloudinary.v2.uploader.upload(image, {
      folder: "gallery",
    });

    res.status(200).json({
      message: "Gallery photo uploaded successfully",
      url: uploadRes.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: error.message || "Upload Failed" });
  }
};
