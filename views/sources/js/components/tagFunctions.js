var tagFunctions = (function(userObject, firebaseDataBase){
  'use strict';
  var buttonClickedCounter = 0;
  var tagReference = '/queue/addTags/tasks';
  checkTags();
  checkBrandTags();
  checkTechTags();
  this.addTag = function addTag(data){
    if(buttonClickedCounter == 0){
      //prevents over pressing
      buttonClickedCounter += 1;
      firebaseDataBase.ref(tagReference).push({'tag': data, 'userId': userObject.uid})
      .then(function(res){
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

  this.addCustomTag = function addCustomTag(data){
    if(data.value.length > 1){
       var data = data.value.split('');
       var firstLetter = data[0].toUpperCase();
       data.splice(0,1); data.unshift(firstLetter); data = data.join('');
       firebaseDataBase.ref(tagReference).push({'tag': data, 'userId': userObject.uid})
       .then(function(res){
         document.getElementById('tags').value = '';
         return;
       })
    }
  }


  function checkTags(){
    firebaseDataBase.ref('/tags/' + userObject.uid).on('value', function(snapshot){
      if(snapshot.val()){
        snapshot.forEach(function(childSnapshot) {
          var buttonHolder = document.getElementById(childSnapshot.val());
          if(buttonHolder){
              removeClass(childSnapshot.val())
          }
          else{
            var newTagButtonEle = document.createElement('button');
            newTagButtonEle.setAttribute("style", "margin-left: 6px; margin-bottom: 5px;");
            newTagButtonEle.addEventListener('click', function(){
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

  var brandTagRefernce = '/queue/addBrandTags/tasks';


  this.addBrandTag = function addBrandTag(data){
    if(buttonClickedCounter == 0){
      //prevents over pressing
      buttonClickedCounter += 1;
      firebaseDataBase.ref(brandTagRefernce).push({'tag': data, 'userId': userObject.uid})
      .then(function(res){
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

  this.addCustomTag = function addCustomTag(data){
    if(data.value.length > 1){
       var data = data.value.split('');
       var firstLetter = data[0].toUpperCase();
       data.splice(0,1); data.unshift(firstLetter); data = data.join('');
       firebaseDataBase.ref(brandTagRefernce).push({'tag': data, 'userId': userObject.uid})
       .then(function(res){
         document.getElementById('tags').value = '';
         return;
       })
    }
  }


  function checkBrandTags(){
    firebaseDataBase.ref('/brandtags/' + userObject.uid).on('value', function(snapshot){
      if(snapshot.val()){
        snapshot.forEach(function(childSnapshot) {
          var buttonHolder = document.getElementById(childSnapshot.val());
          if(buttonHolder){
              removeClass(childSnapshot.val())
          }
          else{
            var newTagButtonEle = document.createElement('button');
            newTagButtonEle.setAttribute("style", "margin-left: 6px; margin-bottom: 5px;");
            newTagButtonEle.addEventListener('click', function(){
              checkTagFunctions.addBrandTag(childSnapshot.val())
            })
            newTagButtonEle.classList.add('btn', 'btn-danger');
            newTagButtonEle.id = childSnapshot.val();
            newTagButtonEle.innerHTML = childSnapshot.val();
            var tagHolder = document.getElementById('brandTagHolder');
            tagHolder.prepend(newTagButtonEle);
          }
        })
      }
    })
  }
  var techTagReference = '/queue/addTechTags/tasks';


  this.addTechTag = function addTechTag(data){
    if(buttonClickedCounter == 0){
      //prevents over pressing
      buttonClickedCounter += 1;
      firebaseDataBase.ref(techTagReference).push({'tag': data, 'userId': userObject.uid})
      .then(function(res){
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

  this.addCustomTag = function addCustomTag(data){
    if(data.value.length > 1){
       var data = data.value.split('');
       var firstLetter = data[0].toUpperCase();
       data.splice(0,1); data.unshift(firstLetter); data = data.join('');
       firebaseDataBase.ref(techTagReference).push({'tag': data, 'userId': userObject.uid}).then(function(res){
         document.getElementById('tags').value = '';
         return;
       })
    }
  }

  function checkTechTags(){
    firebaseDataBase.ref('/techtags/' + userObject.uid).on('value', function(snapshot){
      if(snapshot.val()){
        snapshot.forEach(function(childSnapshot) {
          var buttonHolder = document.getElementById(childSnapshot.val());
          if(buttonHolder){
              removeClass(childSnapshot.val())
          }
          else{
            var newTagButtonEle = document.createElement('button');
            newTagButtonEle.setAttribute("style", "margin-left: 6px; margin-bottom: 5px;");
            newTagButtonEle.addEventListener('click', function(){
              checkTagFunctions.addTechTag(childSnapshot.val())
            })
            newTagButtonEle.classList.add('btn', 'btn-danger');
            newTagButtonEle.id = childSnapshot.val();
            newTagButtonEle.innerHTML = childSnapshot.val();
            var tagHolder = document.getElementById('techTagHolder');
            tagHolder.prepend(newTagButtonEle);
          }
        })
      }
    })
  }


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
