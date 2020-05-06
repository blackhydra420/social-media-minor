const db = firebase.firestore();
const storage = firebase.storage().ref();

var userEmail = "";
var userDocId = "";
var friendId = "";
var isAbleToSend = false;
var room_id;
const days = ["Sunday", "Monday", "Tueseday", "Wednesday", "Thursday", "Friday", "Saturday"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

let loginContainer = document.getElementById("loginContainer");
let signupContainer = document.getElementById("signupContainer");
let afterLogin = document.getElementById("after_login");
const mainBox = document.getElementById("main_box");

const AlertBlur = document.getElementById('alertBlur');
const AlertBox = document.getElementById('alertBox');

function renderAlert(message){
  document.getElementById('alertBody').innerHTML = message;

  AlertBlur.style.display = 'block';
  AlertBox.style.display = 'block';

}

const AlertBtn = document.getElementById('alertButton');

AlertBtn.addEventListener('click', (e) =>{
  e.preventDefault();

  AlertBlur.style.display = 'none';
  AlertBox.style.display = 'none';

  if(!firebase.auth().currentUser.emailVerified) location.reload();
});

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    userDocId = user.displayName;
    userEmail = user.email;
    //checking if user's email is verified or not
    if(!user.emailVerified){
      //console.log(user);
      //console.log("Not verified");
      loginContainer.style.display = "none";
      signupContainer.style.display = 'none';
      document.getElementById("vContainer").style.display = "flex";
      document.getElementById("emailChangeModalFooter").style.display = 'none';
      emailVerification(user);
    }
    else{
      //console.log("user logged in");
      document.getElementById("vContainer").style.display = "none";
      loginContainer.style.display = "none";
      signupContainer.style.display = 'none';
      afterLogin.style.display = "flex";
      
      document.getElementById("user-info").innerHTML = user.displayName;//Setting user name in profile

      //Friend List
      var friendref = db.collection("users").doc(user.displayName);
      
      friendref.onSnapshot(function(doc){
        if (doc.exists) {
          $('.friend-list').empty();
          if((doc.data()).friends.length){
            //console.log("freind exist");
            friends = (doc.data()).friends;
            friends.forEach(function(friend){
              $('.friend-list').append('<li>'+ friend.friend_id + '</li>')
            })
          } else {
            // doc.data() will be undefined in this case
            $('.friend-list').append('<li> You have no friends </li>')
          }
          var friend_id_li = $('.friend-list > li');
          var $li = $('.friend-list li').click(function() {
            $li.removeClass('clicked');
            $(this).addClass('clicked');
          });
          for(var i =0; i<friend_id_li.length;i++){
                   friend_id_li[i].addEventListener('click', function(){
                     mainBox.innerHTML =' <h4 class="topic-heading" id="current-chatter">Name of the person</h4><ul style="list-style: none; max-height: 83vh; overflow:auto" class="chat" id="myChat">                         </ul><form class="message-sending"><span class="msgInputBox"><input class="messageInput" id="m"  autocomplete="off" /></span><button class="msgSendBtn">SEND</button></form>';

                     //auto scroll code start

                     // Select the node that will be observed for mutations
                      const targetNode = document.getElementById('myChat');

                      // Options for the observer (which mutations to observe)
                      const config = { attributes: true, childList: true, subtree: true };

                      // Callback function to execute when mutations are observed
                      const callback = function(mutationsList, observer) {
                          for(let mutation of mutationsList) {
                              if (mutation.type === 'childList') {
                                  // console.log('A child node has been added or removed.');
                                  let scrolly = targetNode.scrollHeight;
                                  targetNode.scrollTo(0, scrolly);
                              }
                          }
                      };

                      // Create an observer instance linked to the callback function
                      const observer = new MutationObserver(callback);

                      // Start observing the target node for configured mutations
                      observer.observe(targetNode, config);

                      //auto scroll code end

                     let inner_friend = this.innerHTML;
                     friendref.get().then(function(doc){
                       if(doc.data().friends){
                         friends = doc.data().friends;
                         friends.forEach(function(friend){
                           //console.log(inner_friend);
                           //console.log(friend.friend_id);
                           if (inner_friend==friend.friend_id){
                              room_id = friend.roomid;
                              //console.log(room_id);
                              document.getElementById("current-chatter").innerHTML = inner_friend;
                              $('.chat').empty();
                        //     var messageref = db.collection("roomid").doc(room_id).collection("messages");
                        //     messageref.get().then(function(querySnapshot) {
                        //     querySnapshot.forEach(function(doc) {
                              
                        //           $('.chat').append('<li>'+ doc.data().sender +":"+ doc.data().message + '</li>')
                        //         console.log(doc.data());
                        //     });
                        // });
                        $(".message-sending").submit(function(e){
                          //console.log($('#m').val());
                          e.preventDefault();
                        var message_val = $("#m").val();
                        if(message_val){
                        var sender_id = $("#user-info")[0].innerHTML;
                        var document_id = (Date.now()).toString();
                        //console.log(message_val + '' + sender_id + '' + document_id);  
                        db.collection("roomid").doc(room_id).collection("messages").doc(document_id).set({
                        sender: sender_id,
                        message: message_val
                         });
                        } else renderAlert("Blank message cannot be sent.");
                         $('#m').val(""); 
                          });
                        db.collection("roomid").doc(room_id).collection("messages")
                            .onSnapshot(function(querySnapshot) {
                                $('.chat').empty();
                                  let senderName = '';
                                  let sender = '';
                                querySnapshot.forEach(function(doc) {
                                  
                                  if(doc.data().sender != senderName){
                                    sender = '<strong class="userInChat">'+ doc.data().sender +'</strong>'
                                    senderName = doc.data().sender;
                                  } else {
                                    sender = '';
                                  }   
                                  let dateObj = new Date(parseInt(doc.id));
                                  //console.log(doc.id);
                                  //console.log(dateObj);
                                  let hour = (parseInt(dateObj.getHours())%12).toString().padStart(2, '0');
                                  let minute = dateObj.getMinutes().toString().padStart(2, '0');
                                  let duration;
                                  
                                  let day = days[dateObj.getDay()];
                                  let month = months[dateObj.getMonth()];
                                  let year = dateObj.getFullYear();
                                  let dayNum = dateObj.getDate();

                                  let fullTime = day +" "+ month +" "+ dayNum +" "+ year;

                                  if(parseInt(dateObj.getHours())/12 == 0){
                                    duration = " AM";
                                  } else {
                                    duration = " PM";
                                  }

                                  let time = hour +":"+ minute + duration;
                                  $('.chat').append(sender +'<li class="row"><span class="col-sm-9">'+ doc.data().message + '</span><span class="col-sm-3 chatTime" data-toggle="tooltip" data-placement="top" title="'+ fullTime +'">'+ time +'</span></li>');
                                    
                                    
                                });
                            });
                            
                           }
                         });
                       }
                     });
                            //$('.chat').append('<li>'+ message.sender +":"+ message.message+ '</li>')
  
                   });
      }
     } 
  });
  
  //Profile loading
  let profileBtn = document.getElementById('user-info');

  profileBtn.addEventListener('click', (e) => {
    e.preventDefault();

    document.getElementById("displayUsername").innerHTML = user.displayName;
    document.getElementById("displayEmail").innerHTML = user.email;
  });

  //notification logic
    db.collection("friendRequests").where("receiver", "==", userDocId)
      .onSnapshot(function(querySnapshot) {
        let ntfPanelUl = document.getElementById("ntf_panel_ul");
          if(querySnapshot.empty){
            //console.log('No friend requests');
            ntfPanelUl.innerHTML = '<li>No friend request</li>';
          } else {
            ntfPanelUl.innerHTML = "";
            querySnapshot.forEach(function(doc) {

                var text = document.createTextNode(doc.data().sender);
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
            //console.log("done");
          }
    });

  }
    //If user is logged out  
  } else {
      //console.log("user logged out");
      loginContainer.style.display = "flex";
      afterLogin.style.display = "none";
    }
  });

//Verification logic

var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'https://social-media-31bce.web.app/',
  // This must be true.
  handleCodeInApp: true,
};

function emailVerification(user){
  let vButton = document.getElementById("vButton");
  let vText = document.getElementById("vText");

  let vEmail = document.getElementById("userEmail");

  vEmail.innerHTML = userEmail;

  vButton.addEventListener('click', (e) =>{
    e.preventDefault();

    user.sendEmailVerification(actionCodeSettings).then(function() {
      // Email sent.
    }).catch(function(error) {
      // An error happened.
    });

    vText.style.display = "block";
    vButton.innerHTML = "Resend";
    vButton.disabled = true;

    //setting timer for resend button
    var myTimeInterval = setInterval(myTimer, 1000);
    var totalTime = 90;

    function myTimer() {
      totalTime = totalTime - 1;
        if(totalTime < 1){
          clearInterval(myTimeInterval);
          vText.style.display = "none";
          vButton.disabled = false;
        }
        var minute = parseInt(totalTime/60);
        var second = totalTime%60;
        
      document.getElementById("vTimer").innerHTML = minute + ":" + second;
    }
  });
}

//logout logic
const logOut = document.getElementById('logout');

logOut.addEventListener('click', (e) =>{
  e.preventDefault();

  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    userEmail = "";
    userDocId = "";
    friendId = "";
    isAbleToSend = false;
    room_id = "";

    mainBox.innerHTML = "";

    document.getElementById("ntf_panel").style.display = "none";

    observer.disconnect();

  }).catch(function(error) {
    // An error happened.
  });
});

//function for addind friend to friend list
function addFrnd(val){
  db.collection("friendRequests").doc(val)
    .get().then(function(doc) {
        if (doc.exists) {
          let sender = doc.data().sender;
          let receiver = doc.data().receiver;
          let roomid = doc.data().roomid;

          //updating friend on receiver side
          db.collection("users").doc(receiver).get()
            .then(function(doc) {
              if(doc.exists){
                let friendsArr = doc.data().friends;
                friendsArr.push({
                  friend_id: sender,
                  roomid : roomid
                });
                db.collection("users").doc(receiver).update({
                  friends: friendsArr
                }).then(() =>{
                  //console.log("successfully friend added");
                });
              }
            }).catch(function(error){
              //console.log(error);
            });

          //updating friend on sender side
          db.collection("users").doc(sender).get()
            .then(function(doc) {
              if(doc.exists){
                let friendsArr = doc.data().friends;
                friendsArr.push({
                  friend_id: receiver,
                  roomid : roomid
                });
                db.collection("users").doc(sender).update({
                  friends: friendsArr
                }).then(() =>{
                  //console.log("successfully friend added");
                });
              }
            }).catch(function(error){
              //console.log(error);
            });
            db.collection("roomid").doc(roomid).set({
              roomd_id_created:true
            })
            .then(function() {
              //console.log("Room Id created");
          })
          .catch(function(error) {
              //console.error("Error writing document: ", error);
          });
            //console.log("Document data:", doc.data());
        } else {
            // doc.data() will be undefined in this case
            //console.log("No such document!");
        }
    }).then(() =>{
      deleteFrndRequest(val);
    }).catch(function(error) {
        //console.log("Error getting document:", error);
    });
}

//function for deleting requests
function deleteFrndRequest(val){
  db.collection("friendRequests").doc(val).delete().then(function() {
      //console.log("Document successfully deleted!");
  }).catch(function(error) {
      //console.error("Error removing document: ", error);
  });
}

//login form logic
const loginForm = document.getElementById("loginForm");

loginForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const email = document.getElementById("user_email").value;
    const password = document.getElementById("user_pass").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then((cred) =>{
        loginForm.reset();
        //console.log(cred)
        
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        renderAlert(error.message);
    });
});

//signup form logic
const signupForm = document.getElementById("signupForm");

signupForm.addEventListener('submit', (e) =>{
    e.preventDefault();

    const createEmail = document.getElementById("user_create_email").value;
    const createdn = document.getElementById("user_create_dn").value;
    const createPassword = document.getElementById("user_create_pass").value;
    const cpassword = document.getElementById("user_con_pass").value;

    if(cpassword == createPassword){
      let userNameRef = db.collection("users").doc(createdn);

      userNameRef.get().then(function(doc) {
          if (doc.exists) {
              renderAlert("Username already exist");
          } else {
              // doc.data() will be undefined in this case
              
                firebase.auth().createUserWithEmailAndPassword(createEmail, createPassword).then((cred) =>{
                  // Add a new document in collection "users"
                    db.collection("users").doc(createdn).set({
                      id: cred.user.email,
                      username: createdn,
                      friends: []
                    })
                    .then(function() {
                      //console.log("Document successfully written!");
                      //update the username of user
                      cred.user.updateProfile({
                        displayName: createdn
                      }).then(function() {
                        // Update successful.
                        //console.log("username updated");
                        //console.log(cred.user.displayName);
                      }).catch(function(error) {
                        // An error happened.
                      });
  
                      signupForm.reset();
                      //console.log("signedup");
                    })
                    .catch(function(error) {
                      //console.error("Error writing document: ", error);
                    });
                }).catch(function(error) {
                  // Handle Errors here.
                  var errorCode = error.code;
                  var errorMessage = error.message;
                  // ...
                  renderAlert(error.message);
                });
              
              
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });

    } else {
      renderAlert("password do not match");
    }
});

//search bar logic
const seachBar = document.getElementById("searchBar");

seachBar.addEventListener('submit',(e) =>{
  e.preventDefault();

  let userSearch = document.getElementById("searchInput").value;
  //console.log(userSearch);

  db.collection("users").where("id", "==", userSearch)
    .get()
    .then(function(querySnapshot) {
      if(querySnapshot.empty){
        db.collection("users").where("username", "==", userSearch)
        .get()
        .then(function(querySnapshot) {
          if(querySnapshot.empty){
            //console.log("no search result");
            mainBox.innerHTML = '<h4 class="topic-heading">Result</h4><div class="container" style="display: flex; flex-direction: column; justify-content: center; height: calc(100% - 58px);"><h3 class="noSearchResult"><i class="fa fa-search"></i> no search result</h3></div>';
          } else {
            serachUser(querySnapshot);
          }
        })
        .catch(function(error) {
            //console.log("Error getting documents: ", error);
        });
      } else {
        serachUser(querySnapshot);
      }
    })
    .catch(function(error) {
        //console.log("Error getting documents: ", error);
    });
});

//user searching function
function serachUser(querySnapshot){
  querySnapshot.forEach(function(doc) {
    // doc.data() is never undefined for query doc snapshots
    //console.log(doc.id, " => ", doc.data());
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
        //console.log(isRequested);
      }
    }).then(() =>{
    
      //console.log(isRequested);

      if(isRequested){
        buttonText = '<button id="sendRequest" class="btn btn-info disabled">Sent</button>';
        //console.log("request present");
      } else {

        var friends = doc.data().friends;
        for(let i = 0; i<friends.length; i++ ){
          if(friends[i].friend_id == userDocId){
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
      mainBox.innerHTML = '<h4 class="topic-heading">Result</h4><div class="container" style="display: flex; flex-direction: column; justify-content: center; height: calc(100% - 58px);"><div class="card shadow" style="width: 18rem; margin: auto;"><img src="assets/images/default-profile.png" class="card-img-top" alt="..."><div class="card-body"><h6 class="card-title">Email: '+ doc.data().id +'</h6><h6 class="card-title">Username: '+ doc.data().username +'</h6>'+ buttonText +'</div></div></div>';

      if(!isFriend && friendId != userDocId && !isRequested){
        isAbleToSend = true;
        requestSend();
      }
    });
  });
}

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
          roomid: userDocId + friendId
        })
        .then(function() {
          //console.log("Document successfully written!");
          sendRequest.setAttribute('class', 'btn btn-info disabled');
          sendRequest.innerHTML = 'Sent';
          isAbleToSend = false;
          something();
        })
        .catch(function(error) {
          //console.error("Error writing document: ", error);
        });
      } else {
        sendRequest.setAttribute('class', 'btn btn-info disabled');
      }
    });
}

//pasword cahnge function
const changePassForm = document.getElementById("changePass");

changePassForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let oldPass = document.getElementById("user_old_pass").value;
  let newPass = document.getElementById("user_new_pass").value;
  let reNewPass = document.getElementById("user_renew_pass").value;

  if(reNewPass == newPass){

    document.getElementById("changePassSpinner").style.display = 'inline-block';

    let user = firebase.auth().currentUser;
    let credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPass);

    user.reauthenticateWithCredential(credential).then(function() {
      user.updatePassword(newPass).then(function() {
        // Update successful.
        //console.log("password updated");
        changePassForm.reset();
        document.getElementById("changePassSpinner").style.display = 'none';
        $("#changePassModal").modal('hide');
      }).catch(function(error) {
        document.getElementById("changePassSpinner").style.display = 'none';
        renderAlert(error.message);
      });
    }).catch(function(error) {
      document.getElementById("changePassSpinner").style.display = 'none';
      renderAlert(error.message);
    });
  } else {
    document.getElementById("changePassSpinner").style.display = 'none';
    renderAlert("Password do not match");
  }
});

//change email function
const changeEmailForm = document.getElementById("changeEmail");

changeEmailForm.addEventListener('submit', (e) => {
  e.preventDefault();

  let newEmail = document.getElementById("user_new_email").value;
  let userPass = document.getElementById("user_email_pass").value;

  document.getElementById("changeEmailSpinner").style.display = 'inline-block';

    let user = firebase.auth().currentUser;
    let credential = firebase.auth.EmailAuthProvider.credential(user.email, userPass);
    
    user.reauthenticateWithCredential(credential).then(function() {
      // User re-authenticated.
      user.updateEmail(newEmail).then(function() {
        // Update successful.
        //updating user document
        db.collection("users").doc(userDocId).update({
          id: newEmail
        })
        .then(function() {
          //console.log("Document successfully updated!");
        })
        .catch(function(error) {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error);
        });

        //updating UI
        document.getElementById("userEmail").innerHTML = user.email;
        changeEmailForm.reset();
        document.getElementById("changeEmailSpinner").style.display = 'None';
        $("#changeEmailModal").modal('hide');
        renderAlert("Your email has been updated.");
      }).catch(function(error) {
        // An error happened.
        document.getElementById("changeEmailSpinner").style.display = 'None';
        renderAlert(error.message);
      });
    }).catch(function(error) {
      document.getElementById("changeEmailSpinner").style.display = 'None';
      renderAlert(error.message);
    });
});

//File uploading function
