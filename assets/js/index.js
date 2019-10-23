

function login(){
    var userEmail = document.getElementById("user_email").value;
    var userPass = document.getElementById("user_pass").value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        window.alert(errorMessage);
      });
}
