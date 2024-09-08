<?php
include "dbConn.php";
session_start();

$data = json_decode($_POST["data"], true);

// Error flag
$error = false;

foreach ($data as $row) {
    // Assign values
    $store_id = $row['id'];
    $name = $row['name'];
    $lat = $row['lat'];
    $lon = $row['lon'];

    $query = "INSERT INTO stores (Store_id, Name, lat, lon) VALUES ('$store_id', '$name', $lat, $lon) ON DUPLICATE KEY UPDATE Store_id = '$store_id', Name = '$name', lat = $lat, lon = $lon";

    if (!mysqli_query($link, $query)) {
        $error = true;
        error_log("Error inserting data: " . mysqli_error($link));
        break;
    }
}

// Send back a response
echo $error ? 0 : 1;
?>
