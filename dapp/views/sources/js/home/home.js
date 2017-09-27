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
var userObj;

firebase.auth().onAuthStateChanged(function(user) {
  if(user){
   console.log("you are logged in!")
   userObj = user;
   if(userObj.uid){
     document.getElementById('login').style.display = 'none';
     document.getElementById('dashboard').style.display = 'block';
     document.getElementById('logout').style.display = 'block';

   }else{
     ///
   }
  }
})



function login(){
  //user already logged in
  // if(userObj.uid){
  //   firebase.database().ref('/phone/' + userObj.uid).on('value', function(snapshot){
  //     if(snapshot.val()){
  //       console.log(snapshot.val(), 'userType is avil')
  //
  //     }
  //   })
  //   firebase.database().ref('/userType/' + userObj.uid).on('value', function(snapshot){
  //     if(snapshot.val()){
  //       console.log(snapshot.val(), 'userType is avil')
  //
  //     }
  //   })
  // }
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    // console.log("inside login Function", user.email)
    setTimeout(function(){
      console.log(userObj)
      checkUserInfo();

    }, 1000)

    }).catch(function(error) {
     // Handle Errors here.
     var errorCode = error.code;
     var errorMessage = error.message;
     // The email of the user's account used.
     var email = error.email;
     // The firebase.auth.AuthCredential type that was used.
     var credential = error.credential;
    //  console.log(errorCode, errorMessage, email, credential, error)
     // ...
    });
}




function dashboard(){
  firebase.database().ref('/phone/' + userObj.uid).on('value', function(snapshot){
    if(snapshot.val()){
      console.log(snapshot.val(), 'userType is avil');
      if(snapshot.val().confirmed === true){
        console.log(snapshot.val().confirmed);
        firebase.database().ref('/usertype/' + userObj.uid).on('value', function(snapshot2){
          if(snapshot2.val()){
            console.log(snapshot2.val(), 'userType is avil');
            var usertype = snapshot2.val().type;
            if(usertype === 99){
              window.location = "/a-settings";

            }
            if(usertype === 10){
              window.location = "/v-settings";

            }
          }else{
            window.location = "/usertype";
          }
        })
      }
    }
    else{
      window.location = "/phone";

    }
  })
}

function checkUserInfo(){
  var redirectUrl;
  console.log("hitting check user info function")

  firebase.database().ref('user/' + userObj.uid).on('value', function(snapshot) {
    var data = snapshot.val();
    console.log(data)
    if(data){
      firebase.database().ref('/phone/' + userObj.uid).on('value', function(snapshot){
        if(snapshot.val()){
          if(snapshot.val().confirmed){
              firebase.database().ref('/usertype/' + userObj.uid).on('value', function(snapshot){
                console.log(snapshot.val().type)
                if(snapshot.val().type){

                  if(snapshot.val().type == "99"){
                    window.location = "/a-settings";
                  }

                  if(snapshot.val().type == "10"){
                    window.location = "/v-settings";
                  }

                }else{
                  window.location = "/usertype";
                }
              })
            }else{
              window.location = "/phone"
            }
          }
       })
      }
      else{
      console.log("First time user data saving")
      var displayName = userObj.displayName;
      var email = userObj.email;
      var emailVerified = userObj.emailVerified;
      var photoURL = userObj.photoURL;
      var isAnonymous = userObj.isAnonymous;
      var uid = userObj.uid;
      var providerData = userObj.providerData;
      redirectUrl = "/phone"

      writeUserData(uid, displayName, email, photoURL, redirectUrl);

    }
  })
}
function writeUserData(userId, name, email, imageUrl) {
  console.log(userId, "inside writeUserData");
  firebase.database().ref('user/' + userId).set({
   username: name,
   email: email,
   profile_picture : imageUrl
 }).then(function(){
   window.location = "/phone"
 })
}

function logout(){
  firebase.auth().signOut().then(function() {
    document.getElementById('login').style.display = 'block';
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('logout').style.display = 'none';
    console.log('you are logged out!')
  }).catch(function(error) {
    // An error happened.
  });
}
