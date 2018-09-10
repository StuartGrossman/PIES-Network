var progressBar = (function(userObject, firebaseDataBase){
  'use strict';
  var userDataSize = 0;
  var userTagDataSize = 0;
  var progress = 0;
  var userDataRef = firebaseDataBase.ref('userData/' + userObject.uid);
  var tagsDataRef = firebaseDataBase.ref('tags/' + userObject.uid);
  var progressBarDataRef = firebaseDataBase.ref('progressBar/' + userObject.uid);
  // var userRef = firebaseDataBase.ref('user/' + userObject.uid);

  setInitalObjects();

  this.startDataCheck = function startDataCheck(){
    setTimeout(function(){
      //Waits for initalValues to be set;
      userDataRef.on('value', function(snapshot) {
        if(snapshot.val()){
          var temp = userDataSize
          userDataSize = Object.keys(snapshot.val()).length;
          if(temp === userDataSize - 1){
            sendProgressBarQueue(userDataSize, userTagDataSize);
          }
        }
      });
      tagsDataRef.on('value', function(snapshot) {
        if(snapshot.val()){
          var temp = userTagDataSize;
          userTagDataSize = Object.keys(snapshot.val()).length;
          if(userTagDataSize - 1 === temp){
            sendProgressBarQueue(userDataSize, userTagDataSize);
          }else if(userTagDataSize + 1 === temp){
            sendProgressBarQueue(userDataSize, userTagDataSize);
          }
        }else{
          userTagDataSize = 0;
          sendProgressBarQueue(userDataSize, userTagDataSize);
        }
      });
    }, 300);
  }

  function setInitalObjects(){
    userDataRef.once('value', function(snapshot) {
      if(snapshot.val()){
        userDataSize = Object.keys(snapshot.val()).length;
      }
    });
    tagsDataRef.once('value', function(snapshot) {
      if(snapshot.val()){
        userTagDataSize = Object.keys(snapshot.val()).length;
      }
    });
    progressBarDataRef.on('value', function(snapshot) {
      var claimEle = document.getElementById('claimToken');
      var checkMark = document.getElementById('checkMark');
      if(snapshot.val()){
        progress = snapshot.val().progress;
        progress = Math.round(progress * 100) / 100 //round progress
        var progressBarEle = document.getElementById('progressBar');
        var percentageCompleted = document.getElementById('percentageCompleted');
        percentageCompleted.innerHTML = progress + '%';
        progressBarEle.style.width = progress + '%';
        console.log(progress)
        if(progress === 100 && snapshot.val().freeTokenClaimed === false){
          claimEle.style.display = 'inital';
          checkMark.style.display = 'block';
          percentageCompleted.style.display = 'none';
        }
        else if(progress === 100 && snapshot.val().freeTokenClaimed === true){
          claimEle.style.display = 'none';
          checkMark.style.display = 'block';
          percentageCompleted.style.display = 'none';
        }
        else if(progress < 100 && snapshot.val().freeTokenClaimed === false){
          claimEle.style.display = 'none';
          checkMark.style.display = 'none';
          percentageCompleted.style.display = 'block';


        }
        else if(progress < 100 && snapshot.val().freeTokenClaimed === true){
          claimEle.style.display = 'none';
          checkMark.style.display = 'none';
          percentageCompleted.style.display = 'block';


        }
        else{
          claimEle.style.display = 'none';
        }
      }
    });
  }

  function sendProgressBarQueue(userData, tagData){
    var queue = firebaseDataBase.ref('/queue/progressBar/tasks');
    queue.push({'userData': userData, 'tagData': tagData,'userId': userObject.uid}).then(function(){
      //checks status of percentage in server
        return;
    })
  }


})
