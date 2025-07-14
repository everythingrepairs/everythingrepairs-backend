// routes/admin.js
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const sendReviewEmail = require("../utils/email");

// PATCH: Mark job as completed & send review email
router.patch("/complete/:id", async (req, res) => {
  try {
    const request = await Request.findById(req.params.id).populate("userId");

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "completed";
    await request.save();

    // Send review email to client
    const clientEmail = request.userId.email;
    const handymanName = request.handymanName || "your handyman"; // optional
    const requestId = request._id;

    await sendReviewEmail(clientEmail, handymanName, requestId);

    res.status(200).json({ message: "Job marked as completed and email sent." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to complete request or send email." });
  }
});

module.exports = router;

