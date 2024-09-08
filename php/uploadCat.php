<?php
// Include the database connection script
include "dbConn.php";
session_start();

// Decode the incoming POST data into PHP associative arrays
$categories = json_decode($_POST["categories"], true);
$subcategories = json_decode($_POST["subcategories"], true);
$products = json_decode($_POST["products"], true);


// Prepare statement for inserting into 'categories'
$stmtCategory = $link->prepare("INSERT INTO categories (category_id, name) VALUES (?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)");

// Prepare statement for inserting into 'subcategories'
$stmtSubcategory = $link->prepare("INSERT INTO subcategories (subcategory_id, category_id, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE subcategory_id = VALUES(subcategory_id), category_id = VALUES(category_id), name = VALUES(name)");

// Prepare statement for inserting into 'products'
$stmtProduct = $link->prepare("INSERT INTO products (product_id, product_name, category_id, subcategory_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE product_id = VALUES(product_id), product_name = VALUES(product_name), category_id = VALUES(category_id), subcategory_id = VALUES(subcategory_id)");

$error = false; // Flag to indicate if any error occurs during insertion

// Insert categories
foreach ($categories as $category) {
    // Bind parameters to the prepared statement
    $stmtCategory->bind_param("ss", $category['id'], $category['name']);
    // Execute the prepared statement; log error if insertion fails
    if (!$stmtCategory->execute()) {
        $error = true;
        error_log("Error inserting category: " . $stmtCategory->error);
        break;
    }
}

// Insert subcategories
foreach ($subcategories as $subcategory) {
    $stmtSubcategory->bind_param("sss", $subcategory['id'], $subcategory['categoryId'], $subcategory['name']);
    if (!$stmtSubcategory->execute()) {
        $error = true;
        error_log("Error inserting subcategory: " . $stmtSubcategory->error);
        break;
    }
}

// Insert products
foreach ($products as $product) {
    $stmtProduct->bind_param("ssss", $product['id'], $product['name'], $product['category'], $product['subcategory']);
    if (!$stmtProduct->execute()) {
        $error = true;
        error_log("Error inserting product: " . $stmtProduct->error);
        break;
    }
}

// Cleanup: Close the prepared statements to free up resources
$stmtCategory->close();
$stmtSubcategory->close();
$stmtProduct->close();

// Return a success or failure indication: 1 for success, 0 for failure
echo $error ? 0 : 1;
?>
