// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ["client", "handyman", "admin"], default: "client" },
  verified: { type: Boolean, default: false },
  subscribed: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  skills: [{ type: String }],
  profilePicture: { type: String },
  portfolioImages: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
