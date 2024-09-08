<?php
include "dbConn.php";
session_start();

$data = json_decode($_POST["data"], true);

// Prepare an SQL statement for inserting the price data.
$stmt = $link->prepare("INSERT INTO prices (product_id, price, date) VALUES (?, ?, ?)");

// Bind the parameters.
$stmt->bind_param("ids", $product_id, $price, $date); 

foreach ($data as $row) {
    // Assign values to bound parameters.
    $product_id = $row['id'];
    $price = $row['price'];
    $date = $row['date'];

    // Execute the prepared statement.
    $stmt->execute();
}

// Close the prepared statement.
$stmt->close();

echo 1;
?>
