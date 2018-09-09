var tagFunctions = (function(userObject, firebaseDataBase){
  'use strict';
  var buttonClickedCounter = 0;
  var tagReference = '/queue/addTags/tasks';
  checkTags();
  function checkTags(){
    firebaseDataBase.ref('/tags/' + userObject.uid).on('value', function(snapshot){
      if(snapshot.val()){
        snapshot.forEach(function(childSnapshot) {
          var buttonHolder = document.getElementById(childSnapshot.val());
          if(buttonHolder){
              removeClass(childSnapshot.val())
          }
          else{
            console.log('appending')
            var newTagButtonEle = document.createElement('button');
            // <button class="btn btn-unpressed" style="margin-left: 6px; margin-bottom:5px;" id="Books" onclick="checkTagFunctions.addTag('Books')">Books</button>
            //create and add element if it does not exist

            newTagButtonEle.setAttribute("style", "margin-left: 6px; margin-bottom: 5px;");
            // newTagButtonEle.setAttribute("style", );
            newTagButtonEle.addEventListener('click', function(){
              console.log('wtf')
              checkTagFunctions.addTag(childSnapshot.val())
            })
            newTagButtonEle.classList.add('btn', 'btn-danger');
            newTagButtonEle.id = childSnapshot.val();
            newTagButtonEle.innerHTML = childSnapshot.val();
            var tagHolder = document.getElementById('tagHolder');
            tagHolder.prepend(newTagButtonEle);
          }
        })
      }
    })
  }

  this.addTag = function addTag(data){
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
       data.splice(0,1); data.unshift(firstLetter); data = data.join('');
       firebaseDataBase.ref(tagReference).push({'tag': data, 'userId': userObject.uid}).then(function(res){
         console.log('customeTagadded');
         return;
       })
    }
  }
})
