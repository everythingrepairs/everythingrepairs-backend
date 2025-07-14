// routes/review.js
const express = require("express");
const router = express.Router();
const Request = require("../models/Request");
const User = require("../models/User");

// Submit a review after job is completed
router.post("/:requestId", async (req, res) => {
  const { rating, comment } = req.body;
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: "Request not found" });
    }

    if (request.status !== "completed") {
      return res.status(400).json({ error: "Job not completed yet" });
    }

    request.review = { rating, comment };
    await request.save();

    // Update handyman's average rating
    const handymanRequests = await Request.find({
      assignedTo: request.assignedTo,
      "review.rating": { $exists: true }
    });

    const totalRating = handymanRequests.reduce((sum, r) => sum + r.review.rating, 0);
    const avgRating = totalRating / handymanRequests.length;

    await User.findByIdAndUpdate(request.assignedTo, { rating: avgRating });

    res.json({ message: "Review submitted and handyman rating updated." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit review" });
  }
});

module.exports = router;
