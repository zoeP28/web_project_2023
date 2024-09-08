<?php
include "dbConn.php";
session_start();

// Check if the id is set
if(isset($_POST["id"])) {
    $id = ($_POST["id"]);

    $query = "UPDATE products SET inventory = CASE WHEN inventory='Yes' THEN 'No' ELSE 'Yes' END WHERE product_id = '$id'";
    if(mysqli_query($link, $query)) {
        echo json_encode(["success" => true, "message" => "Inventory updated successfully."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating inventory."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Product ID not provided."]);
}
?>
