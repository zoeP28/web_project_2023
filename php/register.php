<?php
// Start the session and include the database connector
session_start();
include "dbConn.php";

// Initialize the result array
$result = array();

// Get input data from the POST request
$username = $_POST['username'];
$email = $_POST['email'];
$password = $_POST['password'];

// Hash the pass
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Check if the provided username or email already exist in the database
$result1 = mysqli_query($link, "SELECT * FROM users WHERE username='$username'");
$result2 = mysqli_query($link, "SELECT * FROM users WHERE email='$email'");

// Username already in use
if (mysqli_num_rows($result1) > 0) {
    echo 0;
    exit();
}
// Email already registered
elseif (mysqli_num_rows($result2) > 0) {
    echo 1;
    exit();
} else {
    // Insert new user into the database
    $result3 = mysqli_query($link, "INSERT INTO users(username, password, email) VALUES('$username', '$hashedPassword', '$email')");

    if ($result3) {
        // Retrieve user information after successful registration
        $query = mysqli_query($link, "SELECT * FROM users WHERE username='$username'");
        if (mysqli_num_rows($query) === 1) {
            $row = mysqli_fetch_assoc($query);
            // Prepare user data for JSON response
            $userData = array(
                'username' => $row['username'],
                'user_id' => $row['user_id'],
                'isAdmin' => $row['isAdmin']
            );
            // Set session variables
            $_SESSION['username'] = $row['username'];
            $_SESSION['user_id'] = $row['user_id'];
            echo json_encode($userData, true);
            exit();
        } else {
            echo 3; // Unexpected error
            exit();
        }
    } else {
        echo 3; // Unexpected error
        exit();
    }
}
?>
