var progressBar = (function(userObject, firebaseDataBase){
  'use strict';
  var userDataSize = 0;
  var userTagDataSize = 0;
  var progress = 0;
  var userDataRef = firebaseDataBase.ref('userData/' + userObject.uid);
  var tagsDataRef = firebaseDataBase.ref('tags/' + userObject.uid);
  var progressBarDataRef = firebaseDataBase.ref('progressBar/' +userObject.uid);
  // var userRef = firebaseDataBase.ref('user/' + userObject.uid);

  setInitalObjects();

  this.startDataCheck = function startDataCheck(){
    userDataRef.on('value', function(snapshot) {
      if(snapshot.val()){
        var temp = userDataSize
        userDataSize = Object.keys(snapshot.val()).length;
        // console.log(userDataSize, temp)
        if(temp === userDataSize -1){
          // console.log('hitting userdata queue')
          sendProgressBarQueue(userDataSize, userTagDataSize);
        }
      }
    });
    tagsDataRef.on('value', function(snapshot) {
      if(snapshot.val()){
        var temp = userTagDataSize;
        userTagDataSize = Object.keys(snapshot.val()).length;
        // console.log(userTagDataSize, temp)
        if(temp === userTagDataSize - 1){
          // console.log('hitting tags queue change')  ;
          sendProgressBarQueue(userDataSize, userTagDataSize);
        }
      }
    });
  }

  function setInitalObjects(){
    userDataRef.once('value', function(snapshot) {
      if(snapshot.val()){
        userDataSize = Object.keys(snapshot.val()).length ;
      }
    });
    tagsDataRef.once('value', function(snapshot) {
      if(snapshot.val()){
        userTagDataSize = Object.keys(snapshot.val()).length;
      }
    });
    progressBarDataRef.on('value', function(snapshot) {
      if(snapshot.val()){
        progress = snapshot.val().progress;
        progress = Math.round(progress * 100) / 100
        var progressBarEle = document.getElementById('progressBar');
        var percentageCompleted = document.getElementById('percentageCompleted');
        percentageCompleted.innerHTML = progress + '%';
        progressBarEle.style.width = progress + '%';
        if(progress === 100 && snapshot.val().freeTokenClaimed === false){
          var claimEle = document.getElementById('claimToken');
          claimEle.style.display = 'block'
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
