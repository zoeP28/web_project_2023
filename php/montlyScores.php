<?php
// Include the database connection
include "dbConn.php";
// Start a session
session_start();

// Initialize an array to store the user data
$userData = [];

// Query the database to retrieve user data
$query = mysqli_query($link, "SELECT `user_id`, `username`, `score`, `overallScore`, `tokens`, `overallTokens` FROM `users` ORDER BY `user_id` ASC");

// Check if there are rows returned from the query
if ($query && mysqli_num_rows($query) > 0) {
  // Fetch all rows as associative arrays and store them in the $userData array
  while ($row = mysqli_fetch_assoc($query)) {
    $userData[] = $row;
  }
}

// Output the user data as JSON
echo json_encode($userData);
?>
