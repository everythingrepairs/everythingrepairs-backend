document.getElementById("requestForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const serviceType = document.getElementById("serviceType").value;
  const description = document.getElementById("description").value.trim();
  const preferredDate = document.getElementById("preferredDate").value;
  const preferredTime = document.getElementById("preferredTime").value;

  if (!fullName || !email || !phone || !serviceType || !description || !preferredDate || !preferredTime) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const response = await fetch("https://your-backend-url.com/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName,
        email,
        phone,
        serviceType,
        description,
        preferredDate,
        preferredTime
      })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Request submitted successfully! We'll reach out shortly.");
      document.getElementById("requestForm").reset();
    } else {
      alert(result.message || "Something went wrong while submitting your request.");
    }
  } catch (error) {
    console.error("Error submitting request:", error);
    alert("An error occurred. Please try again.");
  }
});
