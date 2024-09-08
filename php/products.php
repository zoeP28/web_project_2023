<?php
    include "dbConn.php";
    session_start();

    $subcategory = $_GET['subcategory'];

    $products = array();
    $sql = "SELECT `product_id`, `product_name` FROM `products` WHERE `subcategory_id` = '$subcategory'";

    $result = mysqli_query($link, $sql);

    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }

    echo json_encode($products);
?>