var sliderFunction = (function(userObject, firebaseDataBase){
  'use strict';
  this.personalData = function personalData(selectObj, dataName) {
    var idx = selectObj.selectedIndex;
    var indexedSelectedItem = selectObj.options[idx].value;
    var currentItem = document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0];
    // document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].innerHTML = indexedSelectedItem;
    // document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].style.background = 'white';
    // document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].style.color= 'black';

    document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].innerHTML = indexedSelectedItem;
    document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].style.background = 'white';
    document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].style.color= 'black';
    personalDataQueue(indexedSelectedItem, dataName);
  };

  function personalDataQueue(data, dataName) {
    var queue = firebaseDataBase.ref('/queue/personalData/tasks');
    queue.push({'data': data, 'userId': userObject.uid, 'dataName': dataName}).then(function(){
        return;
    })
  }

  this.displayPersonalData = function displayPersonalData() {
    firebase.database().ref("/userData/" + userObject.uid).once("value", function(snapshot) {
      var count = 0;
      snapshot.forEach(function(childSnapshot) {
        count +=1;
        if(document.getElementById(childSnapshot.key + 'Holder')){
          //logic to change title of each optionPicker
          var currentItem = document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0];
          document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0].innerHTML = childSnapshot.val();
          document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0].style.background = 'white';
          document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0].style.color = 'black';

          //logic for chaning styles and generating title
          // var pickTitle = document.createElement("span");
          // pickTitle.className += 'pickTitle';
          // pickTitle.innerHTML = childSnapshot.key;
          // document.getElementById(childSnapshot.key + 'Holder').appendChild(pickTitle);

        }
        //checks if data is completed
        if(count == 12){
           // document.getElementById('personalDataWrapper').style.display = 'none';
          // var document.getElementById('personaDataCheckMark').style.display = 'inital';
        }
      })

    })
  }
  this.reOpenDisplayData = function(){
    // var document.getElementById('personaDataCheckMark').style.display = 'inital';

     document.getElementById('personalDataWrapper').style.display = 'inital';
  }
})
