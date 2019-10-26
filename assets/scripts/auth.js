firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user logged in");
      console.log(user);
    } else {
      console.log("user logged out");
    }
  });

function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const email = document.getElementById("user_email").value;
    const password = document.getElementById("user_pass").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(() =>{
        loginForm.reset();
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        alert(error.message);
    });
});