document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch("https://your-backend-url.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();

    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(result.user));
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert(result.message || "Invalid login credentials.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Try again later.");
  }
});
