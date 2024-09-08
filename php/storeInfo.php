<?php
// Include the database connection
include "dbConn.php";

// Start a session
session_start();

// Initialize an array to store store information
$stores = array();

// Query to retrieve store information from the database, ordered by store name
$query = "SELECT `store_id`,`name`,`lat`,`lon` FROM `stores` ORDER BY `name` ASC";
$result = mysqli_query($link, $query);

// Check if there are rows in the query result
if (mysqli_num_rows($result) > 0) {
    // Iterate through each row and extract store information
    while ($row = mysqli_fetch_assoc($result)) {
        // Add store information to the $stores array
        array_push($stores, array(
            'store_id' => $row['store_id'],
            'store_name' => $row['name'],
            'lat' => $row['lat'],
            'lon' => $row['lon']
        ));
    }
    // Encode the $stores array as JSON and send it as the response
    echo json_encode($stores, true);
} else {
	echo json_encode(array('message' => 'No stores found.'));
}
?>
