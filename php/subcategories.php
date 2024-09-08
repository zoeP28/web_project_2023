<?php
// Include the database connection
include "dbConn.php";

// Start a session
session_start();

// Get the selected category from the POST request
$category = $_POST['category'];

// Query to retrieve subcategories for the given category
$result = mysqli_query($link, "SELECT `subcategory_id`,`name` FROM `subcategories` WHERE `category_id` = '$category'");

// Create an array to store subcategory information
$products = array();

// Check if there are results from the query
if (mysqli_num_rows($result) > 0) {
    // Loop through each row of results
    while ($row = mysqli_fetch_assoc($result)) {
        // Push subcategory information into the products array
        array_push($products, array('subcategory_id' => $row['subcategory_id'], 'name' => $row['name']));
    }
    // Encode the products array as JSON and echo it
    echo json_encode($products, true);
}
// No results found
?>
