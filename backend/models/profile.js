// models/Profile.js
const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skill: { type: String, required: true },
  bio: { type: String },
  profilePic: { type: String },
  pastWorkPhotos: [String],
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
