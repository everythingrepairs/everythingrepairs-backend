// routes/request.js
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const Profile = require("../models/Profile");
const nodemailer = require("nodemailer");

// Submit new service request
router.post("/", async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully!", request: newRequest });
  } catch (err) {
    console.error("Error submitting request:", err);
    res.status(500).json({ error: "Failed to submit request" });
  }
});

// Get all requests (for admin dashboard)
router.get("/", async (req, res) => {
  try {
    const requests = await Request.find().populate("assignedHandyman");
    res.json(requests);
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});

// Assign a handyman to a request
router.put("/:id/assign", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    const { handymanId } = req.body;

    if (!request) return res.status(404).json({ error: "Request not found" });

    request.assignedHandyman = handymanId;
    request.status = "assigned";
    await request.save();

    res.json({ message: "Handyman assigned successfully", request });
  } catch (err) {
    console.error("Error assigning handyman:", err);
    res.status(500).json({ error: "Failed to assign handyman" });
  }
});

// Mark request as completed and send review email
router.put("/:id/complete", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) return res.status(404).json({ error: "Request not found" });

    request.status = "completed";
    await request.save();

    // Send email to client
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const reviewLink = `http://localhost:3000/review.html?requestId=${request._id}`;

    await transporter.sendMail({
      from: `"EverythingRepairs" <${process.env.EMAIL_USER}>`,
      to: request.email,
      subject: "How was your handyman service?",
      html: `
        <p>Dear ${request.name},</p>
        <p>Thanks for using EverythingRepairs!</p>
        <p>Please rate the handyman who helped you by clicking below:</p>
        <a href="${reviewLink}" style="padding: 10px 20px; background: #2d89e5; color: white; text-decoration: none;">Leave a Review</a>
        <p>We appreciate your feedback!</p>
      `
    });

    res.json({ message: "Job marked as completed and review email sent!" });
  } catch (err) {
    console.error("Error marking as completed:", err);
    res.status(500).json({ error: "Could not complete request" });
  }
});

// Submit review for a completed request
router.post("/:requestId/review", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const requestId = req.params.requestId;

    const request = await Request.findById(requestId);
    if (!request || request.status !== "completed") {
      return res.status(400).json({ error: "Request not found or not completed" });
    }

    request.review = {
      rating,
      comment,
      submitted: true
    };

    await request.save();
    res.json({ message: "Review submitted successfully!" });
  } catch (err) {
    console.error("Review submission error:", err);
    res.status(500).json({ error: "Could not submit review" });
  }
});

module.exports = router;


