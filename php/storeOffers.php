<?php
// Include the database connection file
include "dbConn.php";
// Start a session
session_start();

// Get the input data from the POST request
$input = $_POST['input'];

// Create an array to store the fetched products
$products = array();

// Check if the input is an array
if (is_array($input)) {
  // If input is an array, use IN clause to fetch discounts for multiple input values efficiently
  // Convert the input array to a comma-separated list for the IN clause
  $inputList = implode("','", $input);
  
  // Construct the query to fetch discounts for the specified discount IDs
  $query = "SELECT stores.name, stores.lat, stores.lon, products.product_name, products.product_id, products.inventory, discounts.discount_id, discounts.store_id, discounts.user_id, discounts.price, discounts.date, discounts.likes, discounts.dislikes, users.username, users.score, users.overallScore FROM products INNER JOIN discounts ON products.product_id = discounts.product_id INNER JOIN stores ON stores.store_id = discounts.store_id INNER JOIN users ON users.user_id = discounts.user_id WHERE discounts.discount_id IN ('$inputList') ORDER BY stores.name ASC";
} else {
  // If input is not an array, fetch discounts based on category ID
  // Construct the query to fetch discounts for the specified category ID
  $query = "SELECT stores.name, stores.lat, stores.lon, products.product_name, products.product_id, products.inventory, discounts.discount_id, discounts.store_id, discounts.user_id, discounts.price, discounts.date, discounts.likes, discounts.dislikes, users.username, users.score, users.overallScore FROM categories INNER JOIN products ON products.category_id = categories.category_id INNER JOIN discounts ON discounts.product_id = products.product_id INNER JOIN stores ON stores.store_id = discounts.store_id INNER JOIN users ON users.user_id = discounts.user_id WHERE categories.category_id = '$input' ORDER BY stores.name ASC";
}

// Execute the query
$result = mysqli_query($link, $query);

// Fetch and store the results in the products array
if (mysqli_num_rows($result) > 0) {
  while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
  }
}

// Encode the products array as JSON and send the response
echo json_encode($products);
?>
