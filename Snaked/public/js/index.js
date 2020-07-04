//////////////////////////////////
//                              //
//    index.js for Snaked.io    //
//      by Anthony Riley        //
//                              //
//////////////////////////////////

const socket = io();

let profiles = firebase.firestore().collection("profiles");
let id_token = "ERROR";

// Main
setTimeout(() => {
  hide("loading");
  if(id_token == "ERROR") show("login");
}, 500);

function hide(state) {
  document.getElementById(state).style.display = "none";
}

function show(state) {
  document.getElementById(state).style.display = "flex";
}

function logged_in(googleUser){
  id_token = googleUser.getAuthResponse().id_token.split(".")[0];

  var profile = googleUser.getBasicProfile();
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  hide("login");
  show("loading");
  profiles.doc(id_token).get().then(doc => {
    if(doc.exists) {
      hide("loading");
      show("menu");
      document.getElementById("welcome_username").innerHTML = doc.data().username;
    }
    else show("create_account");
  }).catch(error => {
    hide("loading");
    show("error");
  })
}

function sign_out() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      hide("menu");
      show("login");
    }).catch(error => {
      hide("menu");
      show("error");
    });
  }

  function create_account(){
    let username = document.getElementById("username").value;

    // Check if input exists
    if(username.length < 1){
      document.getElementById("username_input_error").style.display = "block";
      document.getElementById("username_input_error").style.margin = "0px";
      document.getElementById("username_input_error").innerHTML = "Please input a valid username.";
      return;
    }

    // Check username already exists
    profiles.doc("taken_usernames").get().then(doc => {
      if(doc.data().usernames.includes(username)){
        document.getElementById("username_input_error").style.display = "block";
        document.getElementById("username_input_error").style.margin = "0px";
        document.getElementById("username_input_error").innerHTML = "Username already taken. Please try again.";
        return;
      }
      // Create the Account
      profiles.doc(id_token).set({
        username: username,
        elo: 3000
      });
      // Add the username to the list of already taken usernames
      profiles.doc("taken_usernames").update({
        usernames: firebase.firestore.FieldValue.arrayUnion(username)
      });

      document.getElementById("welcome_username").innerHTML = username;
      hide("create_account");
      show("menu");
    });
  }

  function find_normal_game(){
    socket.emit("find_normal_game", {
      elo: 3000
    });
  }
