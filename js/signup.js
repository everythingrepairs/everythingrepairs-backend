document.getElementById("signupForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const userType = document.getElementById("userType").value;

  if (!name || !email || !password || !userType) {
    alert("Please fill out all fields.");
    return;
  }

  try {
    const response = await fetch("https://your-backend-url.com/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, userType })
    });

    const result = await response.json();

    if (response.ok) {
      alert("Signup successful! Please log in.");
      window.location.href = "login.html";
    } else {
      alert(result.message || "Signup failed.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("Something went wrong. Try again.");
  }
});
