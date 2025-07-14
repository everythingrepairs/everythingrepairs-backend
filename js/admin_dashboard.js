document.addEventListener("DOMContentLoaded", () => {
  loadPendingRequests();
});

async function loadPendingRequests() {
  try {
    const res = await fetch("https://your-backend-url.com/admin/pending-requests");
    const requests = await res.json();

    const container = document.getElementById("pendingRequests");
    container.innerHTML = "";

    for (const req of requests) {
      const li = document.createElement("li");
      li.innerHTML = `
        <p><strong>Client:</strong> ${req.fullName}</p>
        <p><strong>Service:</strong> ${req.serviceType}</p>
        <p><strong>Description:</strong> ${req.description}</p>
        <label>Assign to:</label>
        <select class="handymanList" data-request-id="${req._id}">
          <option value="">Loading handymen...</option>
        </select>
        <button class="assignBtn" data-request-id="${req._id}">Assign</button>
      `;
      container.appendChild(li);

      // Load handymen for this service
      loadQualifiedHandymen(req.serviceType, li.querySelector(".handymanList"));
    }

    container.querySelectorAll(".assignBtn").forEach((btn) => {
      btn.addEventListener("click", assignRequest);
    });
  } catch (err) {
    console.error("Error loading requests:", err);
  }
}

async function loadQualifiedHandymen(skill, dropdown) {
  try {
    const res = await fetch(`https://your-backend-url.com/admin/qualified-handymen?skill=${skill}`);
    const handymen = await res.json();

    dropdown.innerHTML = `<option value="">-- Select Handyman --</option>`;
    handymen.forEach((hm) => {
      dropdown.innerHTML += `
        <option value="${hm._id}">${hm.name} (⭐${hm.rating || "N/A"})</option>
      `;
    });
  } catch (err) {
    console.error("Error loading handymen:", err);
    dropdown.innerHTML = `<option value="">Failed to load</option>`;
  }
}

async function assignRequest(e) {
  const requestId = e.target.dataset.requestId;
  const select = document.querySelector(`select[data-request-id="${requestId}"]`);
  const handymanId = select.value;

  if (!handymanId) {
    alert("Please select a handyman to assign.");
    return;
  }

  try {
    const res = await fetch("https://your-backend-url.com/admin/assign-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, handymanId }),
    });

    const result = await res.json();

    if (res.ok) {
      alert("Request assigned successfully.");
      loadPendingRequests(); // Refresh
    } else {
      alert(result.message || "Failed to assign request.");
    }
  } catch (err) {
    console.error("Assignment error:", err);
    alert("Error assigning request.");
  }
}
