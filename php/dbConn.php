<?php
$hostname = 'localhost'; 
$database = 'e_kata'; 
$db_user = 'root'; 
$db_pass = ''; 

header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$link = mysqli_connect("$hostname", "$db_user", "$db_pass", "$database");


if ($link === false) {
	die("ERROR: Could not connect. " . mysqli_connect_error());
}

