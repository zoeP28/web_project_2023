<?php
// Include the database connector to establish a connection with the database
include "dbConn.php";

// Start a new or resume existing session
session_start();

// Query to fetch all data from the `categories` table
$result = mysqli_query($link, "SELECT * FROM `categories`");
$categories = array(); // Initialize an empty array to store category data

// Check if the query returned any rows
if (mysqli_num_rows($result) > 0) {
    // Fetch each row of data and append it to the $categories array
    while ($row = mysqli_fetch_assoc($result)) {
        array_push($categories, array('category_id' => $row['category_id'], 'name' => $row['name']));
    }

    // Return the categories data as a JSON response
    echo json_encode($categories, true);
}
