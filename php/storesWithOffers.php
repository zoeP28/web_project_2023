<?php

include "dbConn.php";

$store_discount_counts = array();

// Construct the query to fetch the number of discounts per store
$query = "SELECT discounts.store_id, COUNT(*) as discount_count FROM discounts GROUP BY discounts.store_id HAVING discount_count > 0";

// Execute the query
$result = mysqli_query($link, $query);

// Fetch and store the results
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $store_discount_counts[$row['store_id']] = $row['discount_count'];
    }
}

echo json_encode($store_discount_counts);
?>
