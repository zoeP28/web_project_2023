<?php
include "dbConn.php";
session_start();

// Check if the id is set
if(isset($_POST["id"])) {
    $id = $_POST["id"];
    $username = $_POST["username"];

    // Use prepared statements to prevent SQL injection
    $stmt = $link->prepare("DELETE discounts FROM discounts INNER JOIN users ON users.user_id = discounts.user_id WHERE product_id = ? AND username = ?");
    $stmt->bind_param('ss', $id, $username);  // 's' specifies the variable type => 'string'

    // Execute the query and check for errors
    if($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Offer removed successfully from the discounts."]);
    } else {
        echo json_encode(["success" => false, "message" => "Error removing offer from the discounts."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Product ID not provided."]);
}
?>
