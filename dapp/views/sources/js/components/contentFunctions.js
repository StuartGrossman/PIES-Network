var contentFunctions = (function(userObject, firebaseDataBase){
  'use-strict';
  //Load function takes all content and creates html canvas for each custom content request
  this.load = function load(){
    firebaseDataBase.ref('content/' + userObject.uid).on('value', function(snapshot){
      var data = snapshot.val();
      if(data){
        if(data.unwatched){
          //sets Content Alerts Number
          document.getElementById('contentAlerts').innerHTML = data.unwatched;
          //loops through unwatched content
          for(var i in data.contentList){
            var lookup = data.contentList[i].lookup
            firebaseDataBase.ref('publishedContent/' + data.contentList[i].author).once('value', function(contentData){
              if(contentData.val()){
                var contentEle = document.createElement('li');
                var dataId = data.contentList[i].author;
                var openContentLink = document.createElement('a');
                //creates button for opening the modal -- /publishedData/userId/ lookup
                openContentLink.addEventListener('click', function(){
                  openContentLink.setAttribute('data-toggle', 'modal');
                  openContentLink.setAttribute('data-target', '#' + lookup + 'Modal');
                })
                openContentLink.innerHTML = contentData.val()[lookup].productInfo.title;
                contentEle.appendChild(openContentLink);
                document.getElementById('contentHolder').appendChild(contentEle);
                //creates Modals for content
                contentFunctions.createContentWindow(contentData.val()[lookup], lookup, data);
              }
            })
          }
        }
      }
    })
  }

  this.createContentWindow = function createContentWindow(data, id, contentData){
    var blankModal = document.getElementById('blankModal').cloneNode(true);
    blankModal.id = id + 'Modal'
    document.getElementById('outerModalHolder').appendChild(blankModal);

    var modalBody = blankModal.childNodes[1].childNodes[1]
    //sets title
    modalBody.childNodes[1].children[1].childNodes[1].innerHTML = data.productInfo.title + '  |  ' + '<span style="font-size:12px">' +  data.productInfo.info +'</span>';

    //sets tags and userData
    setDataTags(contentData.contentList[id].tags, modalBody);
    setDataTags(contentData.contentList[id].userData, modalBody);


    //sets image

    modalBody.children[2].childNodes[1].setAttribute('src', data.source.capta);




    console.log(modalBody.children[1]);

  }

  function setDataTags(data, modalBody){
    var tagEle = document.createElement('div');
    tagEle.classList.add('btn', 'smallTag');
    for(var i in data){
      var tempTagEle = tagEle.cloneNode(true);
      tempTagEle.innerHTML = data[i]
      modalBody.children[1].appendChild(tempTagEle)
    }
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
