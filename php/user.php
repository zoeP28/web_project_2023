<?php
// Start the session to access session variables
session_start();

// Include the database connection
include "dbConn.php";

// Get the user_id from the session
$user_id = $_SESSION['user_id'];

// Initialize an empty result array to store the user's data
$result = array();

// Prepare the SQL statement with a placeholder
$stmt = $link->prepare("SELECT username, score, overallScore, tokens, overallTokens, likes, dislikes FROM users WHERE user_id = ?");
if (!$stmt) {
    die('SQL statement preparation failed: ' . htmlspecialchars($link->error));
}

// Bind the user_id parameter to the placeholder
$stmt->bind_param('s', $user_id); 

// Execute the prepared statement
$stmt->execute();

// Bind the result to variables
$stmt->bind_result($username, $score, $overallScore, $tokens, $overallTokens, $likes, $dislikes); 


// Fetch the result
if ($stmt->fetch()) {
    array_push($result, array(
        'username' => $username,
        'score' => $score,
        'overallScore' => $overallScore,
        'tokens' => $tokens,
        'overallTokens' => $overallTokens,
        'likes' => $likes,
        'dislikes' => $dislikes
    ));
}

// Close the statement
$stmt->close();

// Encode the result array as JSON and send it as a response
echo json_encode($result, true);
?>
