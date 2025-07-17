// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const authRoutes = require("./routes/auth");
const requestRoutes = require("./routes/request");
const adminRoutes = require("./routes/admin");
const profileRoutes = require("./routes/profile");
const reviewRoutes = require("./routes/review");
const adminAssignRoutes = require("./routes/adminAssign");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // For uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/request", requestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminAssignRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/review", reviewRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB Atlas");

    // Use dynamic port for Render
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`🚀 Server started on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
