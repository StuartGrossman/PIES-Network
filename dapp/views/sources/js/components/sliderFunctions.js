var sliderFunction = (function(userObject, firebaseDataBase){
  'use strict';
  this.personalData = function personalData(selectObj, dataName) {
    var idx = selectObj.selectedIndex;
    var indexedSelectedItem = selectObj.options[idx].value;
    document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].innerHTML = indexedSelectedItem;
    document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].style.background = '#03a9f3';
    document.getElementById(dataName + 'Holder').childNodes[1].childNodes[0].style.color= 'white';


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
      snapshot.forEach(function(childSnapshot) {

        if(document.getElementById(childSnapshot.key + 'Holder')){
          //logic to change title of each optionPicker
          document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0].innerHTML = childSnapshot.val();
          document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0].style.background = '#03a9f3';
          document.getElementById(childSnapshot.key + 'Holder').childNodes[1].childNodes[0].style.color= 'white';

          //logic for chaning styles and generating title
          // var pickTitle = document.createElement("span");
          // pickTitle.className += 'pickTitle';
          // pickTitle.innerHTML = childSnapshot.key;
          // document.getElementById(childSnapshot.key + 'Holder').appendChild(pickTitle);

        }
      })

    })
  }

})
