
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

let ntcPanel = document.getElementById("ntf_panel");
let ntfButton = document.getElementById("notification");

ntfButton.addEventListener('click',(e) =>{
  e.preventDefault();
  console.log("clicked");
  if(ntcPanel.style.display == "none"){
    ntcPanel.style.display = "block";
  } else {
    ntcPanel.style.display = "none";
  }
  let bell = document.getElementById("bell");
  bell.removeAttribute('class');
  bell.setAttribute('class', 'far fa-bell');
});


//jQuery scripts

$(document).ready(function(){
  //Tooltip script
  $('[data-toggle="tooltip"]').tooltip();

});
