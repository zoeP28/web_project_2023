<?php

include "dbConn.php";
session_start();

$firstDate = $_POST["firstDate"];
$lastDate = $_POST["lastDate"];

$discounts = [];

// Prepare the SQL statement
$stmt = $link->prepare("SELECT discount_id, date FROM discounts WHERE date > ? AND date < ? ORDER BY date ASC");

// Bind parameters
$stmt->bind_param("ss", $firstDate, $lastDate);

// Execute the query
$stmt->execute();

// Bind the result to variables
$stmt->bind_result($discount_id, $date);

// Fetch the results
while ($stmt->fetch()) {
    $discounts[] = ['discount_id' => $discount_id, 'date' => $date];
}

// Close the statement
$stmt->close();

echo json_encode($discounts);
?>
