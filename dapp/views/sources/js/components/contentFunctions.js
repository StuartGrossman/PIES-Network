var contentFunctions = (function(userObject, firebaseDataBase){
  'use-strict';


  //function evaluates progress and hits loader()
  this.watchForLoad = function watchForLoad(){
    firebaseDataBase.ref('progressBar/' + userObject.uid).on('value', function(progressData){
      var progress = progressData.val().progress;
      if(progress != 100){
        //if progress is not 100 remove content viewing and child nodes
        deleteChildNodes();
      }
      else{
        document.getElementById('contentContainer').style.display = 'block';

        contentFunctions.load();
      }
    })
  }
  function deleteChildNodes(){
    document.getElementById('contentContainer').style.display = 'none';
    var myNode = document.getElementById('contentHolder');
    //removes all child element4s
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
  }
  //function watchs for loader
  function watchLoader(id){
    firebaseDataBase.ref('/content/' + userObject.uid + '/contentList/' + id ).on('value', function(snapshot){
      // console.log(snapshot.val())
      if(snapshot.val().progress.loader.show === true){
        //slight delay before bring up loader window .
          setTimeout(function(){
            document.getElementById('loaderStart').click()
          },300)
      }
      else{
          document.getElementById('closeLoaderModal').click();
      }
    })
  }

  var exitScreen = false;
  var tagEle = document.createElement('div');
  tagEle.classList.add('btn', 'smallTag');
  //Load function takes all content and creates html canvas for each custom content request
  this.load = function load(){
    // deleteChildNodes();

    var alertCount = 0;
    setTimeout(function(){
      //waits for alert number to be populated from loop
      document.getElementById('contentAlerts').innerHTML = alertCount;
    },1000)
    firebaseDataBase.ref('content/' + userObject.uid).once('value', function(snapshot){
      var data = snapshot.val();
      if(data){
        //sets Content Alerts Number
        //loops through unfinished content
        for(var i in data.contentList){
          //Adds to alertCount for ammount of content Objects exist
          alertCount += 1;
          var lookup = data.contentList[i].lookup
          watchLoader(lookup) //function to watch for loader and change styling
          firebaseDataBase.ref('publishedContent/' + data.contentList[i].author).once('value', function(contentData){
            if(contentData.val()){
              var contentEle = document.createElement('li');
              var dataId = data.contentList[i].author;
              var openContentLink = document.createElement('a');
              //creates button for opening the modal -- /publishedData/userId/ lookup
              //Uses the $contentID as pointer in ID
              openContentLink.addEventListener('click', function(){
                openContentLink.setAttribute('data-toggle', 'modal');
                openContentLink.setAttribute('data-target', '#' + lookup + 'Modal');
                openContentLink.setAttribute('id', 'open' + lookup + 'Modal');

              })
              // console.log(contentData.val()[lookup], lookup, data)
              openContentLink.innerHTML = contentData.val()[lookup].productInfo.title;
              contentEle.appendChild(openContentLink);
              document.getElementById('contentHolder').appendChild(contentEle);
              //creates Modals for content
              const currentContent = contentData.val()[lookup];
              createContentWindow(currentContent, lookup, data);
            }
          })
        }
      }
    })
  }

  function createContentWindow(data, id, contentData){
    var blankModal = document.getElementById('blankModal').cloneNode(true);
    blankModal.id = id + 'Modal';
    document.getElementById('outerModalHolder').appendChild(blankModal);
    var currentContent = contentData.contentList[id];
    var modalBody = blankModal.childNodes[1].childNodes[1]
    //sets title percentage and payment ammount
    var modalHeaderContent = data.productInfo.title + '  |  '
    + '<span style="font-size:12px">'
    +  data.productInfo.info +'</span>' +  ' | '
    + '<span style="color:#fb9678; opacity: 0.8"> '
    + currentContent.payout +'</span>'
    + '<span style="font-size:12px; color:#fb9678; opacity:0.75">'
    + ' PIES' + '</span>';

    modalBody.childNodes[1].children[1].childNodes[1].innerHTML = modalHeaderContent;
    //setting match percentage
    var tempTagEle = tagEle.cloneNode(true);

    matchPercentage = '<span style="font-size:12px">'
    + currentContent["match%"]
    + '%' + ' Match' + '</span>';
    tempTagEle.innerHTML = matchPercentage

    tempTagEle.classList.add('btn-danger')

    modalBody.children[1].appendChild(tempTagEle)
    //sets tags and userData
    setDataTags(currentContent.tags, modalBody);
    setDataTags(currentContent.userData, modalBody);
    //

    //sets image

    modalBody.children[2].childNodes[1].setAttribute('src', data.source.capta);

    //sets warning aginst false information
    var warning = '<p style="font-size: 10px; text-align:justify;">By clicking this button you agree to watch this content with engadment and to give accurate feed back. Changing the volume, or skipping will restart this process. Intentionally breaking these rules can result in an account suspension or ban.</p>';
    modalBody.childNodes[7].children[0].children[0].innerHTML = warning

    //sets button event

    var modalButton = modalBody.childNodes[7].children[0].children[1].childNodes[1];

    //Logic is checking state of content/progress
    if((currentContent.progress.video.status === true) && (!currentContent.progress.link.status || !currentContent.progress.response.status)){
      //hides inital elements
      modalBody.childNodes[7].children[0].style.display = 'none';
      modalBody.children[2].children[1].style.display = 'none';
      modalBody.children[2].childNodes[1].style.display = 'none';
      // document.getElementById('contentResponseHolder').style.display = 'blocked';
      // showReponseWindow(id, modalBody);
      // console.log('opening response')
      //video completed
      // if(currentContent.progress.link.status){
      //   //link completed
      //   if(currentContent.progress.response.status){
      //     //response completed
      //     if(!currentContent.progress.userAction.status){
      //       // Checks last step if users has not submited
      //       // This should always be false.
      //     }
      //   }
      // }
      // else{
      //   //LINK LOGIC
      // }
    }
    else{
      //PLAY BUTTON IS HIT
      //FRONT END MEAT LOGIC

      modalButton.addEventListener('click', function(){
        // modalBody.setAttribute('data-dismiss', "modal")
        //function to populate window to watch content
        // createViewModalWindow(data, id, contentData, modalBody);



        //sends START QUEUE
        contentStartQueue(id);

        //starts server request to watch content
        var videoEle = modalBody.children[2].children[1];
        const duration = currentContent.videoLength
        // console.log(duration)
        videoEle.setAttribute('src', data.source.link)
        //hides content banner
        modalBody.children[2].childNodes[1].style.display = 'none';
        //show video
        videoEle.style.display = 'block';
        //starts fullscreen and requests play
        videoEle.webkitRequestFullScreen();
        videoEle.play();
        setTimeout(function(){
          //queue
          var internalTime = true;

          watchVideoTime(videoEle, internalTime, duration, id, modalBody);

        }, (duration * 1000))
        //sets event listners on seeking and volume change, if either occurs reload page
        volumeWatch(videoEle);
        seekerWatch(videoEle);
        //waits 1 second before looking for exit of full screen.
        setTimeout(function(){
          fullScreenWatcher(videoEle);
        }, 1000)
      })
    }
  }
  function showReponseWindow(id, modalBody){

  }
  function watchVideoTime(videoEle, internalTime, duration, id, modalBody){
    var currentTime = videoEle.currentTime;
    // if the current time of the Video is greater than the duration, and interalTime is true.
    // initiate server check.
    if(currentTime + 1 > duration && internalTime){
      contentFinishedQueue(id, modalBody)
    }
  }
  function contentStartQueue(id){
    var queue = firebaseDataBase.ref('/queue/contentStart/tasks');
    queue.push({'userId': userObject.uid, 'contentId': id}).then(function(){
      return;
    })
  }
  function contentFinishedQueue(id, modalBody){
    //sets up next window
    secondStagePopulate(id)
    //linksButton to newly populated window
    document.getElementById('stageTwoStart').setAttribute('data-target', '#blankModalResponse' + id)

    // data-target="#modalResponse"
    // turns off display of video and playButton div
    modalBody.childNodes[7].children[0].style.display = 'none';
    modalBody.children[2].children[1].style.display = 'none';
    exitFullScreenBrowser(); // exits fullscreen on all browsers

    modalBody.childNodes[1].children[0].click();


    exitScreen = true; // prevents eventListener on fullScreen from invoking
    // this line is not working for some reason ..

    //show loading window
    var queue = firebaseDataBase.ref('/queue/contentFinished/tasks');
     queue.push({'userId': userObject.uid, 'contentId': id}).then(function(){
       setTimeout(function(){
         //short wait for dom to update
         // console.log('updating dom')
         // document.getElementById('contentResponseHolder').style.display = 'block';
         // document.getElementById('open' + id + 'Modal').click();
         document.getElementById('stageTwoStart').click();

         //reopenModal
       },2500)


       //starts server request to watch content
       //check database for status of content if True
       //hit function to build next modalBody
       //stop loading window
       return;
     })
  }
  function secondStagePopulate(id){
    var blankModal = document.getElementById('blankModalResponse').cloneNode(true);
    blankModal.id = id + 'Modal'
    var modalBody = blankModal.childNodes[1].childNodes[1]
    //sets title percentage and payment ammount
    var modalHeaderContent = data.productInfo.title + '  |  '
    + '<span style="font-size:12px">'
    +  data.productInfo.info +'</span>' +  ' | '
    + '<span style="color:#fb9678; opacity: 0.8"> '
    + currentContent.payout +'</span>'
    + '<span style="font-size:12px; color:#fb9678; opacity:0.75">'
    + ' PIES' + '</span>';

    modalBody.childNodes[1].children[1].childNodes[1].innerHTML = modalHeaderContent;
    //setting match percentage
    var tempTagEle = tagEle.cloneNode(true);

    matchPercentage = '<span style="font-size:12px">'
    + currentContent["match%"]
    + '%' + ' Match' + '</span>';
    tempTagEle.innerHTML = matchPercentage

    tempTagEle.classList.add('btn-danger')

    modalBody.children[1].appendChild(tempTagEle)
    //sets tags and userData
    setDataTags(currentContent.tags, modalBody);
    setDataTags(currentContent.userData, modalBody);
  }

  function seekerWatch(videoEle){
    videoEle.addEventListener('seeking', function(){
      location.reload();
      return;
    })
  }
  function volumeWatch(videoEle){
    videoEle.addEventListener('volumechange', function(){
      location.reload();
      return;
    })
  }
  function fullScreenWatcher(videoEle){
    document.onwebkitfullscreenchange = function(event){
      if(!exitScreen){
        location.reload();
        return;
      }
      return;
    }
  }

  function setDataTags(data, modalBody){
    for(var i in data){
      var tempTagEle = tagEle.cloneNode(true);
      tempTagEle.innerHTML = data[i]
      modalBody.children[1].appendChild(tempTagEle)
    }
  }
  function exitFullScreenBrowser(){
    if (document.exitFullscreen){
      document.exitFullscreen();
      return;
    }
    else if (document.webkitExitFullscreen){
      document.webkitExitFullscreen();
      return;
    }
    else if (document.mozCancelFullScreen){
      document.mozCancelFullScreen();
      return;
    }
    else if (document.msExitFullscreen){
      document.msExitFullscreen();
      return;
    }
  }

})
