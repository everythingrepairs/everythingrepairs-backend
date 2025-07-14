// routes/profile.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Profile = require("../models/Profile");

// Set up Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // store files in uploads/ folder
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Route to create or update a handyman profile
router.post("/", upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "pastWorkPhotos", maxCount: 10 }
]), async (req, res) => {
  try {
    const { name, skill, bio } = req.body;
    const profilePic = req.files["profilePic"]?.[0]?.path;
    const pastWorkPhotos = req.files["pastWorkPhotos"]?.map(file => file.path);

    const newProfile = new Profile({
      name,
      skill,
      bio,
      profilePic,
      pastWorkPhotos
    });

    await newProfile.save();
    res.status(201).json({ message: "Profile created successfully", profile: newProfile });
  } catch (err) {
    console.error("Profile creation error:", err);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

module.exports = router;
