var contentFunctions = (function(userObject, firebaseDataBase){
  'use-strict';
  //Load function takes all content and creates html canvas for each custome content request
  this.load = function load(){
    firebaseDataBase.ref('content/' + userObject.uid).on('value', function(snapshot){
      var data = snapshot.val();
      if(data){
        if(data.unwatched){
          document.getElementById('contentAlerts').innerHTML = data.unwatched;
          for(var i in data.contentList){
            // console.log(data.contentList[i])

            firebaseDataBase.ref('publishedContent/' + data.contentList[i]).once('value', function(contentData){
              console.log(contentData.val())
              if(contentData.val()){
                var contentEle = document.createElement('li');
                var dataId = data.contentList[i];
                var openContentLink = document.createElement('a');
                openContentLink.addEventListener('click', function(){
                  contentFunctions.createContentWindow(dataId)
                  openContentLink.setAttribute('data-toggle', 'modal');
                  openContentLink.setAttribute('data-target', '#' + dataId + 'Modal');

                })
                openContentLink.innerHTML = contentData.val().title;
                contentEle.appendChild(openContentLink);
                document.getElementById('contentHolder').appendChild(contentEle);
              }
            })
          }
        }
      }
    })
  }

  this.createContentWindow = function createContentWindow(id){
    var blankModal = document.getElementById('blankModal').cloneNode(true);
    blankModal.id = id + 'Modal'
    document.getElementById('outerModalHolder').appendChild(blankModal);

    console.log(blankModal.childNodes[1].childNodes[1].childNodes[1].innerHTML = "test")

  }
})
