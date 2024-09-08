<?php
// Include the database connection file
include "dbConn.php";

// Start a session
session_start();

// Initialize arrays to store data
$array = array();
$result = array();
$storeDiscounts = array();

// Query to retrieve store and discount information from the database
$query = mysqli_query($link, "SELECT stores.store_id, stores.name, stores.lat, stores.lon, discounts.discount_id FROM stores INNER JOIN discounts ON stores.store_id = discounts.store_id ORDER BY stores.store_id ASC");

// Check if there are rows in the query result
if (mysqli_num_rows($query) > 0) {
    // Fetch each row and populate the $array and $unique_id arrays
    while ($row = $query->fetch_assoc()) {
        $storeID = $row['store_id'];
        $storeName = $row['name'];
        $lat = $row['lat'];
        $lon = $row['lon'];
        $discountID = $row['discount_id'];

        // If the store does not exist in the $storeDiscounts array, initialize it
        if (!isset($storeDiscounts[$storeID])) {
            $storeDiscounts[$storeID] = array(
                "id" => $storeID,
                "store_name" => $storeName,
                'lat' => $lat,
                'lon' => $lon,
                'discount_id' => array()
            );
        }

        // Add the discount ID to the corresponding store in $storeDiscounts
        $storeDiscounts[$storeID]['discount_id'][] = $discountID;
    }
}

// Convert the associative array to indexed array for final result
$result = array_values($storeDiscounts);

// Encode the result array as JSON and send it to the client
echo json_encode($result, true);
?>
