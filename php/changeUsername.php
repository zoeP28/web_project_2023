<?php
// Include the database connection script
include "dbConn.php";

// Start or resume the session
session_start();

// Retrieve the user ID from the session
$id = $_SESSION['user_id'];

// Check if 'newUsername' is set in the POST request
if (isset($_POST['newUsername'])) {
    // Store the new username from the POST request
    $new = $_POST['newUsername'];

    $stmt = $link->prepare("UPDATE users SET username=? WHERE user_id=?");

    // Bind the new username and user ID to the prepared statement
    $stmt->bind_param("si", $new, $id);

    // Execute the prepared statement
    $result2 = $stmt->execute();

    // Check the result of the execution
    if ($result2) {
        // If the update was successful, set the new username in the session
        $_SESSION['username'] = $new;
        // Send success response (0) to the client
        echo 0;
    } else {
        // If there was an error, send an error response (1) to the client
        echo 1;
    }

    // Close the prepared statement
    $stmt->close();
} else {
    // If 'newUsername' is not set in the POST request, send an error response (2) to the client
    echo 2;
}
?>
