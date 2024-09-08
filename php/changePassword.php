<?php
// Include the database connection script
include "dbConn.php";

// Start or resume the session
session_start();

// Retrieve the user ID from the session
$id = $_SESSION['user_id'];

// Check if 'newPassword' is set in the POST request
if (isset($_POST['newPassword'])) {
    // Store the new password from the POST request
    $new = $_POST['newPassword'];
    
    // Hash the new password
    $hashedNewPassword = password_hash($new, PASSWORD_DEFAULT);

    // Update the password for the user with the hashed version
    $query = "UPDATE users SET password='" . $hashedNewPassword . "' WHERE user_id=" . $id;
    
    if ($link->query($query) === TRUE) {
        // Send success response (0) to the client if password update is successful
        echo 0;
    } else {
        // If there's an error in updating, send an error response (1) to the client
        echo 1;
    }

} else {
    // If 'newPassword' is not set in the POST request, send an error response (2) to the client
    echo 2;
}
?>
