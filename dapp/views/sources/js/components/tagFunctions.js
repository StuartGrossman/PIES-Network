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
          else{
             //create and add element if it does not exist
          }
        })
      }
    })
  }

  this.addTag = function addTag(data){
    var tagReference = '/queue/addTags/tasks';
    if(buttonClickedCounter == 0){
      //prevents over pressing
      buttonClickedCounter += 1;
      firebaseDataBase.ref(tagReference).push({'tag': data, 'userId': userObject.uid}).then(function(res){
        if(document.getElementById(data)){
          var ele = document.getElementById(data);
          if(ele.classList.contains('btn-unpressed')){
            removeClass(data);
            buttonClickedCounter = 0;
          }else{
            addClass(data);
            buttonClickedCounter = 0;
          }
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
  this.addCustomeTag = function addCustomeTag(data){
    if(data.value.length > 1){
       var data = data.value.split('');
       var firstLetter = data[0].toUpperCase();
       data.splice(0,1);
       data.unshift(firstLetter);
       data = data.join('');
       addTag(data);


    }
  }
})
