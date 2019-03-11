var checkState = (function(){
  'use strict';
  function checkState(user){
    var userRef = firebase.database().ref('user/' + user.uid);
    userRef.on('value', function(snapshot){
      var userStatus = snapshot.val().userType;
        // console.log(userStatus)
        if(userStatus == 10){

          // Onload();
          statusState = false;
          return;
        }else if(userStatus == 99){
          window.location = '/a-dashboard';
          userRef.off();

        }else{
          window.location = '/';
          userRef.off();

        }
      }else if(!statusState && userStatus){
        // window.location = '/';
        // userRef.off();
        return;

      }else {
        window.location = '/';
        userRef.off();
      }
    })
  }


});
