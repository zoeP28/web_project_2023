$(document).ready(function() {
    $("#reset_btn").click(function() {
      const email = $("#email").val();
  
      if (email === "") {
        Swal.fire({
          icon: 'error',
          title: 'Please enter your email.',
          background: '#23242a',
          color: '#45f3ff',
        });
        
      }
  
      $.ajax({
        url: "reset_password.php",
        method: "POST",
        data: { email: email },
        success: function(response) {
          alert(response);
        },
        error: function(xhr, status, error) {
          console.log(error);
        }
      });
    });
  });
  