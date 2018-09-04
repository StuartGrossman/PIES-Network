var tagFunctions = (function(userObject, firebaseDataBase){
  'use strict';
  var buttonClickedCounter = 0;
  this.checkTags = function checkTags(){


    firebaseDataBase.ref('/tags/' + userObject.uid).once('value', function(snapshot){
      if(snapshot.val()){
        snapshot.forEach(function(childSnapshot) {
          var buttonHolder = document.getElementById(childSnapshot.val());
          if(buttonHolder){
              removeClass(childSnapshot.val())
          }
        })
      }
    })
  }

  this.addTag = function addTag(data){
    var tagReference = '/queue/addTags/tasks';
    if(buttonClickedCounter == 0){
      buttonClickedCounter += 1;
      firebaseDataBase.ref(tagReference).push({'tag': data, 'userId': userObject.uid}).then(function(res){
        var ele = document.getElementById(data);
        if(ele.classList.contains('btn-unpressed')){
          removeClass(data);
          buttonClickedCounter = 0;
        }else{
          addClass(data);
          buttonClickedCounter = 0;
        }
      });
    }
  };

  function addClass(id){
    var ele = document.getElementById(id)
    ele.classList.remove('btn-danger');
    ele.className = "btn btn-unpressed"
  }

  function removeClass(id){
    var ele = document.getElementById(id)
    ele.classList.remove('btn-unpressed');
    ele.className = "btn btn-danger"
  }

})
