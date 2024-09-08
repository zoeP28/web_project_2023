<?php
// Enable detailed error reporting for debugging purposes.
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Include the database connection.
include "dbConn.php";

// Start a new or resume existing session.
session_start();

$id = $_POST['id'];
$username = $_POST['username'];
$count = $_POST['count'];
$control = $_POST['control'];
$scoreChange = $_POST['scoreChange'];
$userId = $_POST['userId'];
$userAction = $_POST['userAction'];

// Check if the control variable is set to '1' (indicating a 'like' action).
if ($control == 1) {
    // If 'like', update the 'likes' count in the 'discounts' table.
    $result = mysqli_query($link, "UPDATE `discounts` SET `likes`='$count' WHERE `discount_id`='$id'");
    if (!$result) {
        // If the query fails, terminate the script and display an error message.
        die("Query failed: " . mysqli_error($link));
    }
} else {
    // If 'dislike', update the 'dislikes' count in the 'discounts' table.
    $result = mysqli_query($link, "UPDATE `discounts` SET `dislikes`='$count' WHERE `discount_id`='$id'");
    if (!$result) {
        // If the query fails, terminate the script and display an error message.
        die("Query failed: " . mysqli_error($link));
    }
}

// Retrieve the current score of the user from the 'users' table.
$result2 = mysqli_query($link, "SELECT `score` FROM `users` WHERE `username` = '$username'");
$currentScore = 0;
while ($row = mysqli_fetch_assoc($result2)) {
    $currentScore = $row['score'];
}

// Calculate the user's new score. Ensure it doesn't fall below 0.
$newScore = max(0, $currentScore + $scoreChange);

// Update the user's score in the 'users' table.
$result3 = mysqli_query($link, "UPDATE `users` SET `score`= '$newScore' WHERE `username`= '$username'");

if (!$result3) {
    // If the query fails, terminate the script and display an error message.
    die("Query failed: " . mysqli_error($link));
}

// Update user's likes or dislikes
if ($userAction == "like") {
    $result4 = mysqli_query($link, "UPDATE `users` SET `likes` = `likes` + 1 WHERE `user_id` = '$userId'");
    if (!$result4) {
        die("Query failed: " . mysqli_error($link));
    }
} elseif ($userAction == "dislike") {
    $result4 = mysqli_query($link, "UPDATE `users` SET `dislikes` = `dislikes` + 1 WHERE `user_id` = '$userId'");
    if (!$result4) {
        die("Query failed: " . mysqli_error($link));
    }
}

?>
