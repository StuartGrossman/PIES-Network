var defaultFunctions = (function(userObject, firebaseDataBase){
  'use strict'
  this.login = function login(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      var user = result.user;
      setTimeout(function(){
        checkUserInfo();
      }, 200)
      }).catch(function(error) {
         var errorCode = error.code;
         var errorMessage = error.message;
         var email = error.email;
         var credential = error.credential;
    })
  }
  this.logout = function logout(){
    firebase.auth().signOut().then(function() {
      document.getElementById('login').style.display = 'block';
      document.getElementById('dashboard').style.display = 'none';
      document.getElementById('logout').style.display = 'none';
      console.log('you are logged out!')
    }).catch(function(error) {
      return error;
    });
  }
  this.dashboard = function dashboard(){
    firebase.database().ref('/phone/' + userObj.uid).once('value', function(snapshot){
      if(snapshot.val()){
        if(snapshot.val().confirmed === true){
          firebase.database().ref('/usertype/' + userObj.uid).once('value', function(snapshot2){
            if(snapshot2.val()){
              var usertype = snapshot2.val().type;
              if(usertype === 99){
                window.location = "/p-dashboard";
              }
              if(usertype === 10){
                window.location = "/v-dashboard";

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
    firebase.database().ref('user/' + userObj.uid).on('value', function(snapshot) {
      var data = snapshot.val();
      if(data){
        firebase.database().ref('/phone/' + userObj.uid).on('value', function(snapshot){
          if(snapshot.val()){
            if(snapshot.val().confirmed){
                firebase.database().ref('/usertype/' + userObj.uid).on('value', function(snapshot){
                  console.log(snapshot.val())
                  if(snapshot.val().type){

                    if(snapshot.val().type == "99"){
                      window.location = "/p-dashboard";
                    }

                    if(snapshot.val().type == "10"){
                      window.location = "/v-dashboard";
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
        writeUserData(uid, displayName, email, photoURL);
      }
    })
  }
  function writeUserData(userId, name, email, imageUrl) {
    // console.log(userId, "inside writeUserData");
    //ATTENTION, NEEDS TO BE QUEUE , SERVER ACTION REQUIRED!
    firebase.database().ref('user/' + userId).set({
     username: name,
     email: email,
     profile_picture : imageUrl
   }).then(function(){
     window.location = "/phone"
   })
  }
})