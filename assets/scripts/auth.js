const db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user logged in");
      
      var userEmail = user.email;
      document.getElementById("user-info").innerHTML = user.email;//Setting user name in profile
      //Friend List
      var friendref = db.collection("users").doc(user.uid);
      friendref.get().then(function(doc){
        if (doc.exists) {
          $('.friend-list').empty();
          if((doc.data()).friends){
            friends = (doc.data()).friends;
            friends.forEach(function(friend){
              $('.friend-list').append('<li>'+ friend.friend_id + '</li>')
            })
          }
          
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
  }).catch(function(error) {
      console.log("Error getting document:", error);
  });
    //If user is logged out  
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

//login form logic
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

//signup form logic
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const createEmail = document.getElementById("user_create_email").value;
    const createPassword = document.getElementById("user_create_pass").value;
    const cpassword = document.getElementById("user_con_pass").value;

    if(cpassword == createPassword){

      firebase.auth().createUserWithEmailAndPassword(createEmail, createPassword).then((cred) =>{
          // Add a new document in collection "users"
            db.collection("users").doc(cred.user.uid).set({
              id: cred.user.email
            })
            .then(function() {
              console.log("Document successfully written!");
              signupForm.reset();
              console.log("signedup");
            })
            .catch(function(error) {
              console.error("Error writing document: ", error);
            });
      }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // ...
          alert(error.message);
      });
    } else {
      alert("password do not match");
    }
});