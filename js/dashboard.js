document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("Please log in.");
    window.location.href = "login.html";
    return;
  }

  document.getElementById("username").textContent = user.name;

  if (user.userType === "client") {
    document.getElementById("clientSection").style.display = "block";
    loadClientRequests(user.email);
  } else if (user.userType === "handyman") {
    document.getElementById("handymanSection").style.display = "block";
    loadHandymanDashboard(user._id);
  }
});

// Load client’s submitted service requests
async function loadClientRequests(email) {
  try {
    const res = await fetch(`https://your-backend-url.com/requests?clientEmail=${email}`);
    const data = await res.json();
    const list = document.getElementById("clientRequests");
    list.innerHTML = "";

    data.forEach((req) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${req.serviceType}</strong>: ${req.description} (${req.status})`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load requests", err);
  }
}

// Load handyman's jobs and stats
async function loadHandymanDashboard(handymanId) {
  try {
    const res = await fetch(`https://your-backend-url.com/handyman/${handymanId}`);
    const data = await res.json();

    document.getElementById("jobCount").textContent = data.totalJobs;
    document.getElementById("earnings").textContent = data.totalEarnings;
    document.getElementById("rating").textContent = data.averageRating.toFixed(1);

    const jobList = document.getElementById("assignedJobs");
    jobList.innerHTML = "";

    data.assignedJobs.forEach((job) => {
      const li = document.createElement("li");
      li.textContent = `${job.serviceType}: ${job.description} (${job.status})`;
      jobList.appendChild(li);
    });
  } catch (err) {
    console.error("Failed to load handyman dashboard", err);
  }
}
