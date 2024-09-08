<?php
// Include the database connector
include "dbConn.php";

// Start a new or resume existing session
session_start();

// Check if necessary POST data and session data are set, if not, return an error
if (!isset($_POST['store']) || !isset($_POST['price']) || !isset($_POST['product']) || !isset($_POST['points']) || !isset($_SESSION['user_id'])) {
    echo json_encode(array('error' => 'Required data not provided.'));
    exit;
}

// Store POST and SESSION values in variables
$store = $_POST['store'];
$price = $_POST['price'];
$product = $_POST['product'];
$points = $_POST['points'];
$user_id = $_SESSION['user_id'];

// Update the user's score by adding the points from the current action
$query1 = "UPDATE `users` SET `score` = `score` + $points WHERE `user_id` = '$user_id'";

// Execute the update score query
if (!mysqli_query($link, $query1)) {
    echo "Error updating score: " . mysqli_error($link);
    exit;
}

// Insert a new discount record
$query2 = "INSERT INTO `discounts`(`product_id`, `store_id`, `user_id`, `price`) VALUES ('$product', '$store', '$user_id', '$price')";

// Check if the insertion was successful and return the appropriate message
if (mysqli_query($link, $query2)) {
    // If record inserted successfully, return 1
    echo 1;
} else {
    // If there was an error, return the error message
    echo "Error inserting discount: " . mysqli_error($link);
}
?>
