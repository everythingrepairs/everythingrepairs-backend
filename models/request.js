// models/Request.js
const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  name: String,
  email: String,
  service: String,
  location: String,
  description: String,
  assignedHandyman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile"
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "completed"],
    default: "pending"
  },
  review: {
    rating: Number,
    comment: String,
    submitted: {
      type: Boolean,
      default: false
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Request", requestSchema);
