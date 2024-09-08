<?php
// Include the database connection script
include "dbConn.php";

// Start or resume the session (though not used in this script)
session_start();

// Decode the incoming JSON data from the POST request into an associative array
$data = json_decode($_POST["data"], true);

// Check if data is an array and not empty to prevent issues
if (is_array($data) && !empty($data)) {
    // Loop through each user's data
    foreach ($data as $user) {
        // Construct the UPDATE SQL query
        $query = "UPDATE users SET 
            score = {$user['score']}, 
            overallScore = {$user['overallScore']}, 
            tokens = {$user['tokens']}, 
            overallTokens = {$user['overallTokens']} 
            WHERE user_id = {$user['user_id']}";

        // Execute the SQL query
        if (mysqli_query($link, $query)) {
          // (Optional) Output success message - can be commented out later
          echo "User ID {$user['user_id']} updated successfully.<br>";
      } else {
          // Instead of echoing, log the error. You can replace 'error_log' with your own logging mechanism if desired.
          error_log("Error updating User ID {$user['user_id']}: " . mysqli_error($link));

          // Send a generic error message to the user
          echo "An error occurred while updating the data.<br>";
      }
  }
} else {
  echo "Invalid data provided.";
}
?>
