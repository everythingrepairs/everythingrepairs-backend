// utils/email.js
const nodemailer = require("nodemailer");

const sendReviewEmail = async (to, handymanName, requestId) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"EverythingRepairs" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Rate Your Service Experience",
    html: `
      <h2>Hi there!</h2>
      <p>We hope your experience with <strong>${handymanName}</strong> was great.</p>
      <p>Please take a moment to <strong>rate and review</strong> the service provided.</p>
      <p><a href="https://everythingrepairs.com/review/${requestId}">Click here to leave your review</a></p>
      <br/>
      <p>Thank you for using EverythingRepairs!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Review email sent");
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  }
};

module.exports = sendReviewEmail;
