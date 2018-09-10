var contentFunctions = (function(userObject, firebaseDataBase){
  'use-strict';
  //Load function takes all content and creates html canvas for each custom content request
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
                openContentLink.innerHTML = contentData.val().productInfo.title;
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

  // var contentData;
  // function loadContent(){
  //   console.log(userObject.uid)
  //   firebase.database().ref('publishedContent/' + userObject.uid).once('value', function(snapshot){
  //     console.log(snapshot.val())
  //     if(snapshot.val()){
  //       snapshot.forEach(function(res){
  //         console.log(res.val())
  //         //generate HTML function
  //         console.log(res.val().capta)
  //         contentData = res.val();
  //         console.log(res.val().capta)
  //         document.getElementById('capta').setAttribute('src', res.val().capta)
  //         document.getElementById('content1').setAttribute('src', res.val().capta)
  //         for(var k = 0; k < res.val().tags.length; k++){
  //           console.log()
  //           var tagsName = res.val().tags[k];
  //           var para = document.createElement("span");
  //           para.className += 'tag label label-info'
  //           var node = document.createTextNode('#' + res.val().tags[k]);
  //
  //           para.appendChild(node);
  //           document.getElementById('tags-holder').appendChild(para)
  //
  //         }
  //
  //
  //       })
  //     }
  //   })
  // }
  //
  // function play(){
  //   document.getElementById('videoCage').setAttribute('src', contentData.url);
  //   // document.getElementById('ModalLabel1').style.display = 'none';
  //   plyr.setup();
  //
  //   document.getElementById('capta').style.display = 'none';
  //   document.getElementById('ModalLabel1').style.display = 'none';
  //   document.getElementById('doneButton').style.display = 'block';
  //
  //
  //   document.getElementById('videoCage').style.display = 'block';
  //
  //
  // }
})
