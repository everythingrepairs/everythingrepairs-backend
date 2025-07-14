// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");
const adminRoutes = require("./routes/admin");
const profileRoutes = require("./routes/profile");
const reviewRoutes = require("./routes/review");
const adminAssignRoutes = require("./routes/adminAssign"); // newly added route

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static image files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/admin", adminRoutes); // existing admin routes
app.use("/api/admin", adminAssignRoutes); // new admin assign route
app.use("/api/profile", profileRoutes);
app.use("/api/review", reviewRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");
    app.listen(3000, () => {
      console.log("🚀 Server started on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
