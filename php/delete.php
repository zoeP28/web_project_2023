<?php
// Start the session
session_start();

// Include the database connection script
include "dbConn.php";

// Only proceed if the user is logged in and is an admin
if (!isset($_SESSION['isAdmin']) || $_SESSION['isAdmin'] !== true) {
    echo "Unauthorized access";
    exit; // Stop further execution
}

// Check if 'action' POST parameter is set and is 'deleteAll'
if (isset($_POST['action']) && $_POST['action'] === 'deleteAll') {

    // An array of SQL DELETE queries. 
    $deleteQueries = [
        "DELETE FROM `stores`",
        "DELETE FROM `categories`",
        "DELETE FROM `discounts`",
        "DELETE FROM `prices`",
        "DELETE FROM `products`",
        "DELETE FROM `subcategories`"
    ];
    
    // Begin a transaction - provides safety upon deletion failure
    $link->begin_transaction();

    // Try to execute each delete query
    foreach ($deleteQueries as $query) {
        if (!$link->query($query)) {
            // Rollback all the operations if any query fails
            $link->rollback();
            echo "Error during deletion: " . $link->error;
            exit;
        }
    }

    // If all queries are successful, commit the changes to the database
    $link->commit();
    echo "Deletion successful";
    
} else {
    echo "Invalid action or action not set";
}
?>
