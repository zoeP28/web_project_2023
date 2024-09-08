function toggleTables() {
    let tbl1 = document.getElementById("change_cred_tbl1");
    let tbl2 = document.getElementById("change_cred_tbl2");

    // Check if the first table is currently visible.
    if (tbl1.style.display !== "none") {
        // If the first table is visible, hide it and show the second table.
        tbl1.style.display = "none";
        tbl2.style.display = "block";
    } else {
        // If the first table is hidden, show it and hide the second table.
        tbl1.style.display = "block";
        tbl2.style.display = "none";
    }
}

// navigates to the provided URL.
function navigateTo(url) {
    window.location.assign(url);
}

// This function is used to return to the home page based on the user's role
function return_home() {
    // Retrieve the logged-in user information from localStorage.
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));

    // Set a default redirect URL to "map.html".
    let redirectURL = "map.html";

    // Check if the logged-in user is not an admin
    if (logged_user && logged_user[0] && logged_user[0].isAdmin === "0") {
        // If the user is not an admin, redirect to "map_user.html".
        redirectURL = "map_user.html";
    }

    // Call the navigateTo() function with the determined redirect URL.
    navigateTo(redirectURL);
}
