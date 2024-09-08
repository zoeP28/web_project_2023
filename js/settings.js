document.addEventListener("DOMContentLoaded", () => {
    handleNavigation();
    fetchDataAndInitTable();
});

function handleNavigation() {
    const logged_user = JSON.parse(localStorage.getItem("logged_user"));
    
    if (logged_user[0].isAdmin === "0") {
        $("#nav").load("navbar.html");
        $("#emptyServerBtn").hide();
    } else {
        $("#nav").load("adminNavbar.html");
    }

    document.getElementById("display_user").innerHTML = logged_user[0].username;
}

function fetchDataAndInitTable() {
    $.post("./php/user.php", displayUserInfo);
    $.post("./php/userOffers.php", displayOfferInfo);
}

function displayUserInfo(data) {
    const exportData = data.map(item => ({
        username: item.username,
        user_id: item.user_id,
        score: item.score,
        tokens: item.tokens,
        overallScore: item.overallScore,
        overallTokens: item.overallTokens,
        likes: item.likes,
        dislikes: item.dislikes
    }));

    $("#userTable").bootstrapTable({ data: exportData });
}

function displayOfferInfo(data) {
    const exportData = data.map(item => ({
        product_name: item.product_name,
        name: item.name,
        price: item.price,
        date: item.date,
        likes: item.likes,
        dislikes: item.dislikes,
        inventory: item.inventory
    }));

    const $table2 = $("#userTable2");
    $table2.bootstrapTable({ data: exportData });
    $table2.bootstrapTable("togglePagination");
}

function empty() {
  Swal.fire({
    title: "Emtpy Server",
    text: "This action has no return!",
    icon: "warning",
    showCancelButton: true,
    color: '#ffffff',
    confirmButtonColor: "#008000",
    confirmButtonText: "Yes, ERASE all!",
    background: '#ff0000',
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: "./php/delete.php",
        type: "POST",
        data: { action: "deleteAll"}, // Send 'action=deleteAll' as POST data
        success: function (data) {
          if (data == 1) {
            Swal.fire({
              icon: "success",
              title: "Deleted",
              text: "All info has been completely erased!",
            });
          } else {
            Swal.fire({
              icon: "error",
              title: "Unknown Error",
              text: "Something went wrong!",
            });
          }
        },
      });
    }
  });
}

function changeUsername() {
  Swal.fire({
      title: 'Change Username',
      input: 'text',
      inputPlaceholder: 'Enter new username',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Close',
      background: '#1e293b'
  }).then(result => {
      if (result.isConfirmed) {
          const new_name = result.value;

          if (!new_name) {
              Swal.fire('Error', 'Please enter the new Username', 'error');
              return;
          }

          $.post("./php/changeUsername.php", { newUsername: new_name }, (response) => {
              if (response == 0) {
                // Update the displayed username before showing the success alert
                document.getElementById("display_user").innerHTML = new_name;
                  Swal.fire({
                      title: 'Success',
                      text: 'Your Username has been updated successfully',
                      icon: 'success',
                      onClose: () => {
                          window.location.reload();
                      }
                  });
              } else {
                  Swal.fire('Error', 'An unexpected error has been occurred', 'error');
              }
          });
      }
  });
}

function changePassword() {
    Swal.fire({
        title: 'Change Password',
        input: 'password',
        inputPlaceholder: 'Enter new password',
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        background: '#1e293b'
    }).then(result => {
        if (result.isConfirmed) {
            const newPassword = result.value;

            if (!newPassword) {
                Swal.fire('Warning', 'Password cannot be empty', 'warning');
                return;
            }

            if (!validatePassword(newPassword)) {
              Swal.fire('Invalid Password', 'Your password should contain at least 8 characters, including one uppercase letter, one lowercase letter, one digit, and one special symbol.', 'error');
              return;
            }

            // Send new password to server
            $.post("./php/changePassword.php", { newPassword: newPassword }, (response) => {
                if (response == 0) {
                    Swal.fire('Success', 'Your password has been updated successfully', 'success');
                } else {
                    Swal.fire('Error', 'An error occurred', 'error');
                }
            });
        }
    });
}

function validatePassword(password) {
   // At least one uppercase, one lowercase, one digit, one of !@#$%^&* special symbols, and minimum 8 characters in length
   const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
   return regex.test(password);
}