function register() {
  const username = document.getElementById("user").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  if (!username) return showAlert("warning", "Username", "Username must not be blank!");
  if (!email) return showAlert("warning", "Email", "Email must not be blank!");
  if (!ValidateEmail(email)) return showAlert("warning", "Invalid email", "The format of the email is not valid!");
  if (!password) return showAlert("warning", "Password", "Password must not be blank!");

  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  if (!strongRegex.test(password)) {
    return showAlert("warning", "Password", "Password must include uppercase, lowercase, special character, and numeric letter!");
  }

  $.ajax({
    url: "./php/register.php",
    method: "POST",
    data: { username, password, email },
    success: handleRegistrationSuccess,
    error: handleRegistrationError,
  });
}

function handleRegistrationSuccess(data) {
  // lexiko gia na antistoixisei to response tou server 
  const responses = {
    "0": ["info", "Already in use", "This username is already in use!"],  // gia "0" h "1", antistoixei se ena pinaka
    "1": ["info", "Already in use", "This email is already in use!"], // me tis parametrous gia thn showAlert 
    "2": [showSuccessMessage, redirectToIndex], // gia "2" antistoixei stis duo sunarthseis kai ektelei kai tis 2
  };

  if (responses[data]) {
    if (typeof responses[data][0] === "function") { // Checkarei an eimaste sto "2" wste na ektelesei tis sunarthseis
      responses[data][0]();
      if (responses[data][1]) responses[data][1]();  // an uparxei kai allh sunarthsh proxwraei kai se ayth
    } else { // alliws Ean to prwto stoixeio den einai synartisi, simainei oti einai mia seira apo orismata gia ti synartisi showAlert
      showAlert(...responses[data]); // pernei kathe stoixeio tou pinaka kai to pernaei san parametro sthn showAlert
    }
  } else {
    showSuccessMessage();
    redirectToIndex();
  }
}

function handleRegistrationError(xhr, exception) {
  // Apla ektypwnei to sfalma sto console
  console.log(`Error: ${xhr.status} ${xhr.responseText}`);
}

function showSuccessMessage() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  Toast.fire({
    icon: 'success',
    title: 'Registration Successful. Your account has been created successfully! Redirecting to login page'
  });
}

function ValidateEmail(mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail);
}

function showAlert(icon, title, text, background = '#c0c2c9') {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
    background: background,
    timer: 1500,
    showConfirmButton: false,
  });
}

function redirectToIndex() {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 3000);
}