<?php
// Start the session
session_start();

// Include the database connector file for the database operations.
include "dbConn.php";

// Retrieve the logged-in user's ID from the session.
$user_id = $_SESSION['user_id'];

// Sanitize the user input to reduce risks. This will remove any characters not required for an ID.
// This is a simple prevention measure, but not foolproof.
$user_id = mysqli_real_escape_string($link, $user_id);

// Initialize an empty array to store the result.
$result = array();

// Construct the SQL query. The query fetches offers from the 'discounts' table and 
// joins it with the 'stores' and 'products' tables to get related data.
$query = mysqli_query($link, "SELECT * FROM discounts 
                             INNER JOIN stores ON stores.store_id = discounts.store_id 
                             INNER JOIN products ON products.product_id = discounts.product_id 
                             WHERE discounts.user_id = '$user_id'");

// If the query returns one or more rows, fetch the data and push it to the result array.
if (mysqli_num_rows($query) > 0) {
    while ($row = mysqli_fetch_assoc($query)) {
        array_push($result, array(
            'name' => $row['name'], 
            'price' => $row['price'], 
            'product_name' => $row['product_name'], 
            'likes' => $row['likes'], 
            'dislikes' => $row['dislikes'], 
            'date' => $row['date'], 
            'inventory' => $row['inventory']
        ));
    }
}

// Encode the result array into a JSON string and echo it.
echo json_encode($result, true);
?>
