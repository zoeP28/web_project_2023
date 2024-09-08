<?php
// Simulate token generation (simplified)
$token = "generated_token_here";

// Construct the reset link with the token
$resetLink = "http://localhost/reset_password.html?token=" . $token;
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>Password Reset</title>
  <meta charset="utf-8">
</head>
<body>
  <h2>Password Reset</h2>
  <p>Click the following link to reset your password:</p>
  <a href="<?php echo $resetLink; ?>"><?php echo $resetLink; ?></a>
</body>
</html>
