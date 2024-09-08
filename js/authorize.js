// Get user role from local storage
const userRole = JSON.parse(localStorage.getItem("logged_user"))[0].isAdmin;

if (userRole !== "1") {
  window.location.href = "unauthorized.html"; // Redirect to an unauthorized page
}
