// routes/adminAssign.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Request = require("../models/Request");

// Admin manually assigns job to qualified handyman
router.put("/assign/:requestId/:handymanId", async (req, res) => {
  const { requestId, handymanId } = req.params;

  try {
    const handyman = await User.findById(handymanId);

    if (!handyman || handyman.role !== "handyman") {
      return res.status(404).json({ error: "Handyman not found" });
    }

    if (!handyman.isSubscribed || handyman.rating < 3.5) {
      return res.status(400).json({
        error: "Cannot assign. Handyman is either not subscribed or has a low rating.",
      });
    }

    const request = await Request.findByIdAndUpdate(
      requestId,
      { assignedTo: handymanId, status: "assigned" },
      { new: true }
    );

    res.json({ message: "Request assigned successfully", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to assign request" });
  }
});

module.exports = router;
