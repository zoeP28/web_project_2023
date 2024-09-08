<?php
// Include the database connector to establish a connection with the database
include "dbConn.php";

$categoryId = $_POST['categoryId'];

// SQL Query to get the average price of products in the current week for the specified category
$currentWeekQuery = "
SELECT AVG(price) AS currentWeekAverage
FROM discounts d
JOIN products p ON d.product_id = p.product_id
WHERE p.category_id = '$categoryId' AND YEARWEEK(`date`, 1) = YEARWEEK(CURDATE(), 1)
";

// Execute the query for the current week and store the result
$currentWeekResult = mysqli_query($link, $currentWeekQuery);

// Fetch the average price for the current week from the query result
$currentWeekRow = mysqli_fetch_assoc($currentWeekResult);
$currentWeekAverage = $currentWeekRow['currentWeekAverage'];

// SQL Query to get the average price of products in the previous week for the specified category
$previousWeekQuery = "
SELECT AVG(price) AS previousWeekAverage
FROM discounts d
JOIN products p ON d.product_id = p.product_id
WHERE p.category_id = '$categoryId' AND YEARWEEK(`date`, 1) = YEARWEEK(CURDATE() - INTERVAL 1 WEEK, 1)
";

// Execute the query for the previous week and store the result
$previousWeekResult = mysqli_query($link, $previousWeekQuery);

// Fetch the average price for the previous week from the query result
$previousWeekRow = mysqli_fetch_assoc($previousWeekResult);
$previousWeekAverage = $previousWeekRow['previousWeekAverage'];

// Calculate the average discount as the difference between the current and previous week's average prices
$averageDiscount = $currentWeekAverage - $previousWeekAverage;

// Send the calculated average discount back to the client as JSON data
echo json_encode([
    'currentWeekAverage' => $currentWeekAverage,
    'previousWeekAverage' => $previousWeekAverage,
    'averageDiscount' => $averageDiscount
]);

/* This queries just the average discount per product
$query = "
SELECT AVG(price) AS averageDiscount
FROM discounts d
JOIN products p ON d.product_id = p.product_id
WHERE p.category_id = '$categoryId'
";

$result = mysqli_query($link, $query);

if ($result) {
    $row = mysqli_fetch_assoc($result);
    echo json_encode(['averageDiscount' => $row['averageDiscount']]);
} else {
    echo json_encode(['error' => 'Failed to fetch data.']);
} */
?>
