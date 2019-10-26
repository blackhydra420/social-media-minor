let login = document.getElementById("loginContainer");
let signup = document.getElementById("signupContainer");

function loadForm(){
  if (signup.style.display == "none") {
    signup.style.display = "flex";
    login.style.display = "none";
  } else {
    signup.style.display = "none";
    login.style.display = "flex";
  }
}