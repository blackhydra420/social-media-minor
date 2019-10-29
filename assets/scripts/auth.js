const db = firebase.firestore();
var userEmail = "";
var userDocId = "";
var friendId = "";
var isAbleToSend = false;

let loginContainer = document.getElementById("loginContainer");
let afterLogin = document.getElementById("after_login");

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log("user logged in");
      loginContainer.style.display = "none";
      afterLogin.style.display = "flex";
      
      userEmail = user.email;
      document.getElementById("user-info").innerHTML = user.email;//Setting user name in profile
      userDocId = user.uid;

      //Friend List
      var friendref = db.collection("users").doc(user.uid);
      friendref.onSnapshot(function(doc){
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
          $('.friend-list').append('<li> You have no friends </li>')
      }
  });
    
  //notification logic
    db.collection("friendRequests").where("receiver", "==", userDocId)
      .onSnapshot(function(querySnapshot) {
        let ntfPanelUl = document.getElementById("ntf_panel_ul");
          if(querySnapshot.empty){
            console.log('No friend requests');
            ntfPanelUl.innerHTML = '<li>No friend request</li>';
          } else {
            ntfPanelUl.innerHTML = "";
            querySnapshot.forEach(function(doc) {

                var text = document.createTextNode(doc.data().sender_id);
                var li = document.createElement("li");

                //creating accept button
                var button1 = document.createElement("button");
                button1.setAttribute('class', 'btn btn-primary');
                button1.setAttribute('onclick', 'addFrnd("'+ doc.id +'")');
                var i1 = document.createElement("i");
                i1.setAttribute('class', 'fas fa-check');
                button1.appendChild(i1);

                //creating decline button
                var button2 = document.createElement("button");
                button2.setAttribute('class', 'btn btn-danger');
                button2.setAttribute('onclick', 'deleteFrndRequest("'+ doc.id +'")');
                var i2 = document.createElement("i");
                i2.setAttribute('class', 'fas fa-times');
                button2.appendChild(i2);

                //creating a div
                var div = document.createElement("div");
                div.appendChild(button1);
                div.appendChild(button2);

                //appending all elements to li
                li.appendChild(text);
                li.appendChild(div);
                ntfPanelUl.appendChild(li);
                console.log(doc.id);
                let bell = document.getElementById("bell");
                bell.removeAttribute('class');
                bell.setAttribute('class', 'fas fa-bell');
            })
            console.log("done");
          }
    });

    //If user is logged out  
    } else {
      console.log("user logged out");
      loginContainer.style.display = "flex";
      afterLogin.style.display = "none";
    }
  });

const logOut = document.getElementById('logout');

logOut.addEventListener('click', (e) =>{
  e.preventDefault();

  firebase.auth().signOut().then(function() {
    // Sign-out successful.

  }).catch(function(error) {
    // An error happened.
  });
});


function sendFrndRequest(){
  db.collection("friendRequests").doc().set({
    receiver: "sG48OJNUcRRQzXS1sFo5TTsfJp72",
    sender: "iRpaNYmHgRPTTjAuqOmbPNPtTtP2",
    roomid: "I am god",
    sender_id: "me too"
  })
  .then(function() {
    console.log("Document successfully written!");
  })
  .catch(function(error) {
    console.error("Error writing document: ", error);
  });
}

//function for addind friend to friend list
function addFrnd(val){
  db.collection("friendRequests").doc(val)
    .get().then(function(doc) {
        if (doc.exists) {
          let sender = doc.data().sender;
          let receiver = doc.data().receiver;
          let roomid = doc.data().roomid;
          let sender_id = doc.data().sender_id;

          //updating friend on receiver side
          db.collection("users").doc(receiver).get()
            .then(function(doc) {
              if(doc.exists){
                let friendsArr = doc.data().friends;
                friendsArr.push({
                  friend_id: sender_id,
                  roomid : roomid
                });
                db.collection("users").doc(receiver).update({
                  friends: friendsArr
                }).then(() =>{
                  console.log("successfully friend added");
                });
              }
            }).catch(function(error){
              console.log(error);
            });

          //updating friend on sender side
          db.collection("users").doc(sender).get()
            .then(function(doc) {
              if(doc.exists){
                let friendsArr = doc.data().friends;
                friendsArr.push({
                  friend_id: userEmail,
                  roomid : roomid
                });
                db.collection("users").doc(sender).update({
                  friends: friendsArr
                }).then(() =>{
                  console.log("successfully friend added");
                });
              }
            }).catch(function(error){
              console.log(error);
            });
            console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).then(() =>{
      deleteFrndRequest(val);
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

//function for deleting requests
function deleteFrndRequest(val){
  db.collection("friendRequests").doc(val).delete().then(function() {
      console.log("Document successfully deleted!");
  }).catch(function(error) {
      console.error("Error removing document: ", error);
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
              id: cred.user.email,
              friends: []
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


const mainBox = document.getElementById("main_box");

//search bar logic
const seachBar = document.getElementById("searchBar");

seachBar.addEventListener('submit',(e) =>{
  e.preventDefault();

  let userSearch = document.getElementById("searchInput").value;
  console.log(userSearch);

  db.collection("users").where("id", "==", userSearch)
    .get()
    .then(function(querySnapshot) {
      if(querySnapshot.empty){
        console.log("no search result");
        mainBox.innerHTML = '<h4 class="topic-heading">Result</h4><div class="container" style="display: flex; flex-direction: column; justify-content: center; height: calc(100% - 58px);"><h3 style="text-align: center;"><i class="fa fa-search"></i> no search result</h3></div>';
      } else {
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            friendId = doc.id;
            var buttonText = "";
            var isFriend = false;
            var isRequested = false;

            db.collection("friendRequests").where("receiver", "==", friendId).where("sender", "==", userDocId)
            .get()
            .then(function(querySnapshot) {
              if(querySnapshot.empty){
                isRequested = false;
              } else {
                isRequested = true;
                console.log(isRequested);
              }
            }).then(() =>{
            
              console.log(isRequested);

              if(isRequested){
                buttonText = '<button id="sendRequest" class="btn btn-info disabled">Sent</button>';
                console.log("request present");
              } else {

                var friends = doc.data().friends;
                for(let i = 0; i<friends.length; i++ ){
                  if(friends[i].friend_id == userEmail){
                    buttonText = '<button id="sendRequest" class="btn btn-info disabled">Friends</button>';
                    isFriend = true;
                  }
                }
                if(!isFriend){
                  if(friendId == userDocId){
                    buttonText = "";
                  } else {
                    buttonText = '<button id="sendRequest" class="btn btn-info">send request</button>';
                  }
                }
              }
              mainBox.innerHTML = '<h4 class="topic-heading">Result</h4><div class="container" style="display: flex; flex-direction: column; justify-content: center; height: calc(100% - 58px);"><div class="card shadow" style="width: 18rem; margin: auto;"><img src="assets/images/default-profile.png" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">'+ doc.data().id +'</h5>'+ buttonText +'</div></div></div>';

              if(!isFriend && friendId != userDocId && !isRequested){
                isAbleToSend = true;
                requestSend();
              }
            });
        });
      }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
});

//friend request sending function
function requestSend(){
  let sendRequest = document.getElementById("sendRequest");



    sendRequest.addEventListener('click', (e) =>{
      e.preventDefault();

      if(isAbleToSend){

        // Add a new document in collection "friendRequests"
        db.collection("friendRequests").doc().set({
          receiver: friendId,
          sender: userDocId,
          roomid: userDocId + friendId,
          sender_id: userEmail
        })
        .then(function() {
          console.log("Document successfully written!");
          sendRequest.setAttribute('class', 'btn btn-info disabled');
          sendRequest.innerHTML = 'Sent';
          isAbleToSend = false;
          something();
        })
        .catch(function(error) {
          console.error("Error writing document: ", error);
        });
      } else {
        sendRequest.setAttribute('class', 'btn btn-info disabled');
      }
    });
}
