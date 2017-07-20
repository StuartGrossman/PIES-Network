var config = {
  apiKey: "AIzaSyBNyW7vjQSK2Gbrh4Mzox6G-uAG4gK1rgE",
  authDomain: "adspace-9fe5c.firebaseapp.com",
  databaseURL: "https://adspace-9fe5c.firebaseio.com",
  projectId: "adspace-9fe5c",
  storageBucket: "",
  messagingSenderId: "129227170241"
};
firebase.initializeApp(config);
var provider = new firebase.auth.GoogleAuthProvider();
function writeUserData(userId, name, email, imageUrl, database) {
  console.log(data, userId, "inside writeUserData");
  database().ref('users/' + userId).set({
   username: name,
   email: email,
   profile_picture : imageUrl
  });
}
function login(){
firebase.auth().signInWithPopup(provider).then(function(result) {
  // This gives you a Google Access Token. You can use it to access the Google API.
  var token = result.credential.accessToken;
  // The signed-in user info.
  var user = result.user;
  // console.log("inside login Function", user.email)
  saveUserInfo(user);

  }).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // The email of the user's account used.
   var email = error.email;
   // The firebase.auth.AuthCredential type that was used.
   var credential = error.credential;
   // ...
  });
}
function logout(){
  firebase.auth().signOut().then(function() {
   // Sign-out successful.
  }).catch(function(error) {
   // An error happened.
  });
}
firebase.auth().onAuthStateChanged(function(user) {
  if(user){
   console.log(user)
  }
})

function saveUserInfo(user){
  var redirectUrl;
  var userRef = firebase.database().ref('users/' + user.uid );
        userRef.on('value', function(snapshot) {
          // console.log(snapshot.val());
          if(!snapshot.val() && user){
            // User is signed in.
            var displayName = user.displayName;

            var email = user.email;

            var emailVerified = user.emailVerified;

            var photoURL = user.photoURL;

            var isAnonymous = user.isAnonymous;

            var uid = user.uid;

            var providerData = user.providerData;
            redirectUrl = "/usertype"
            // console.log(user, uid, email)

            writeUserData(uid, displayName, email, photoURL, redirectUrl);

          } else if(snapshot.val()){

            //logic
            window.location = "/";
            console.log("user Already exits")

            // document.getElementById('name').innerHTML = displayName;
          }
        })
}

function writeUserData(userId, name, email, photoURL, redirectUrl) {
  console.log("writing user data!")
  firebase.database().ref('user/' + userId).set({
    username: name,
    email: email,
    profile_picture : photoURL,
    subscribed : false,
    usertype: 0
  });
  window.location = redirectUrl;
}
