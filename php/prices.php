<?php
include "dbConn.php";
session_start();

if (!isset($_POST['product'])) {
    echo json_encode(array('error' => 'Product ID not provided.'));
    exit;
}

$product_id = $_POST['product'];
$user_id = $_SESSION['user_id'];

$currentDate = date("Y-m-d");
$prevDate = date("Y-m-d", strtotime("-7 day", strtotime($currentDate)));

// Get last week's prices for the product
$pricesLastWeek = array();
$queryPrices = mysqli_query($link, "SELECT price, date FROM prices WHERE product_id = '$product_id' AND date >= '$prevDate' AND date <= '$currentDate' ORDER BY date ASC");

while ($row = mysqli_fetch_assoc($queryPrices)) {
    $pricesLastWeek[] = array('price' => $row['price'], 'date' => $row['date']);
}

// Get all discounts for the user
$userDiscounts = array();
$queryDiscounts = mysqli_query($link, "SELECT product_id, store_id, price FROM discounts WHERE user_id = '$user_id'");

while ($row = mysqli_fetch_assoc($queryDiscounts)) {
    $userDiscounts[] = array('product_id' => $row['product_id'], 'store_id' => $row['store_id'], 'price' => $row['price']);
}

$result = array($pricesLastWeek, $userDiscounts);
echo json_encode($result, true);
?>
