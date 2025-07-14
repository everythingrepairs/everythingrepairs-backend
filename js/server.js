// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI, ...)
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const User = mongoose.model("User", new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  userType: String, // 'client', 'handyman', or 'admin'
  verified: Boolean,
  subscribed: Boolean,
  rating: Number,
  skills: [String]
}));

const Request = mongoose.model("Request", new mongoose.Schema({
  fullName: String,
  email: String,
  phone: String,
  serviceType: String,
  description: String,
  preferredDate: String,
  preferredTime: String,
  status: { type: String, default: "pending" },
  handymanId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
}));

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  const adminEmail = req.headers["x-admin-email"];
  if (!adminEmail) return res.status(403).json({ message: "Access denied" });

  User.findOne({ email: adminEmail, userType: "admin" }, (err, user) => {
    if (err || !user) return res.status(403).json({ message: "Unauthorized" });
    next();
  });
}

// Admin-only route to get pending requests
app.get("/admin/pending-requests", isAdmin, async (req, res) => {
  try {
    const requests = await Request.find({ status: "pending" });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests" });
  }
});

// Admin-only route to get qualified handymen
app.get("/admin/qualified-handymen", isAdmin, async (req, res) => {
  const { skill } = req.query;
  try {
    const handymen = await User.find({
      userType: "handyman",
      verified: true,
      subscribed: true,
      skills: skill
    }).sort({ rating: -1 });
    res.json(handymen);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch handymen" });
  }
});

// Admin-only route to assign a request
app.post("/admin/assign-request", isAdmin, async (req, res) => {
  const { requestId, handymanId } = req.body;
  try {
    await Request.findByIdAndUpdate(requestId, {
      handymanId,
      status: "assigned"
    });
    res.json({ message: "Request assigned successfully" });
  } catch (err) {
    res.status(500).json({ message: "Assignment failed" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
