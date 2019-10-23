<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="assets/css/index.css">
    <title>Login</title>
</head>
<body>
    <div class="login_form">
        <h1>Login</h1>
        <input type="email" name="user_email" id="user_email" class="input_field">

        <input type="password" name="user_pass" id="user_pass" class="input_field">

        <button id="login" onclick="login()">Login</button>
    </div>
    
</body>
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
<script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-analytics.js"></script>

<script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/7.2.1/firebase-firestore.js"></script>

<script>
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBVvwZSyn23XyJXHT1hvsghCpiphegoqrQ",
    authDomain: "social-media-31bce.firebaseapp.com",
    databaseURL: "https://social-media-31bce.firebaseio.com",
    projectId: "social-media-31bce",
    storageBucket: "social-media-31bce.appspot.com",
    messagingSenderId: "308617471624",
    appId: "1:308617471624:web:5865e63339515ea0d6613d",
    measurementId: "G-MTELXP8MF4"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
</script>
<script>
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      alert("User loggedin");
      // ...
    } else {
      // User is signed out.
      // ...
      alert("user not loggedin");
    }
  });
</script>
<script src="assets/js/index.js"></script>
</html>