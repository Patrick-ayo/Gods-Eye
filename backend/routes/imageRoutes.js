const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // temporary storage

const Image = require("../models/Image");

router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "godseye",
    });

    // Delete local file after upload
    fs.unlinkSync(filePath);

    // Save to MongoDB with classification
    const image = new Image({
      title: req.body.title || "Untitled",
      imageUrl: result.secure_url,
      isScreenshot: req.body.type === "screenshot",
      isWebcam: req.body.type === "webcam",
      classifiedBy: "manual",
    });
    await image.save();

    res.json({
      success: true,
      url: result.secure_url,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get("/grouped", async (req, res) => {
  try {
    const webcamImages = await Image.find({ isWebcam: true });
    const screenshotImages = await Image.find({ isScreenshot: true });

    res.json({
      media: webcamImages,
      screenshots: screenshotImages,
    });
  } catch (err) {
    console.error("Error fetching images:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
