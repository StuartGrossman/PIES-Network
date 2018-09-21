var contentFunctions = (function(userObject, firebaseDataBase){
  'use-strict';
  var tagEle = document.createElement('div');
  tagEle.classList.add('btn', 'smallTag');
  //Load function takes all content and creates html canvas for each custom content request
  this.load = function load(){

    var alertCount = 0;
    setTimeout(function(){
      //waits for alert number to be populated from loop
      document.getElementById('contentAlerts').innerHTML = alertCount;
    },1000)
    firebaseDataBase.ref('content/' + userObject.uid).on('value', function(snapshot){
      var data = snapshot.val();
      if(data){
        // if(data.unwatched){
          //sets Content Alerts Number
          //loops through unfinished content
          for(var i in data.contentList){
            alertCount += 1;
            console.log(alertCount)
            var lookup = data.contentList[i].lookup
            firebaseDataBase.ref('publishedContent/' + data.contentList[i].author).once('value', function(contentData){
              if(contentData.val()){
                var contentEle = document.createElement('li');
                var dataId = data.contentList[i].author;
                var openContentLink = document.createElement('a');
                //creates button for opening the modal -- /publishedData/userId/ lookup
                console.log('creating button')
                openContentLink.addEventListener('click', function(){
                  openContentLink.setAttribute('data-toggle', 'modal');
                  openContentLink.setAttribute('data-target', '#' + lookup + 'Modal');
                })
                // console.log(contentData.val()[lookup], lookup, data)
                openContentLink.innerHTML = contentData.val()[lookup].productInfo.title;
                contentEle.appendChild(openContentLink);
                document.getElementById('contentHolder').appendChild(contentEle);
                //creates Modals for content
                const currentContent = contentData.val()[lookup]
                contentFunctions.createContentWindow(currentContent, lookup, data);
              }
            })
          // }
        }
      }
    })
  }

  this.createContentWindow = function createContentWindow(data, id, contentData){
    var blankModal = document.getElementById('blankModal').cloneNode(true);
    blankModal.id = id + 'Modal'
    document.getElementById('outerModalHolder').appendChild(blankModal);
    var currentContent = contentData.contentList[id];
    var modalBody = blankModal.childNodes[1].childNodes[1]
    //sets title percentage and payment ammount
    var modalHeaderContent = data.productInfo.title + '  |  ' + '<span style="font-size:12px">' +  data.productInfo.info +'</span>' +  ' | ' + '<span style="color:#fb9678; opacity: 0.8"> ' + currentContent.payout +'</span>' + '<span style="font-size:12px; color:#fb9678; opacity:0.75">' + ' PIES' + '</span>' ;

    modalBody.childNodes[1].children[1].childNodes[1].innerHTML = modalHeaderContent;
    //setting match
    matchPercentage = '<span style="font-size:12px">' + currentContent["match%"] + '%' + ' Match' + '</span>'
    var tempTagEle = tagEle.cloneNode(true);
    tempTagEle.classList.add('btn-danger')

    tempTagEle.innerHTML = matchPercentage
    modalBody.children[1].appendChild(tempTagEle)
    //sets tags and userData
    setDataTags(currentContent.tags, modalBody);
    setDataTags(currentContent.userData, modalBody);
    //

    //sets image

    modalBody.children[2].childNodes[1].setAttribute('src', data.source.capta);

    //sets warning aginst false information
    var warning = '<p style="font-size: 10px;">By clicking this button you agree to watch this content with engadment and to give accurate feed back. Intentionally breaking these rules can result in an account suspension or ban.</p>';
    modalBody.childNodes[7].children[0].children[0].innerHTML = warning

    //sets button event

    var modalButton = modalBody.childNodes[7].children[0].children[1].childNodes[1];
    if(currentContent.progress.video.status){
      //video completed
    }else{
      //PLAY BUTTON IS HIT
      modalButton.addEventListener('click', function(){
        // modalBody.setAttribute('data-dismiss', "modal")
        //function to populate window to watch content
        // createViewModalWindow(data, id, contentData, modalBody);



        //sends START QUEUE
        contentStartQueue(id);

        //starts server request to watch content
        let videoEle = modalBody.children[2].children[1];

        videoEle.setAttribute('src', data.source.link)
        //hides content banner
        modalBody.children[2].childNodes[1].style.display = 'none';
        //show video
        videoEle.style.display = 'block';
        //starts fullscreen and requests play
        videoEle.webkitRequestFullScreen();
        videoEle.play();
        //sets event listners on seeking and volume change, if either occurs reload page
        volumeWatch(videoEle)
        seekerWatch(videoEle)
      })
    }
  }
  function contentStartQueue(id){
    var queue = firebaseDataBase.ref('/queue/contentStart/tasks');
    queue.push({'userId': userObject.uid, 'contentId': id}).then(function(){
      return;
    })
  }
  function contentFinishedQueue(id){
    var queue = firebaseDataBase.ref('/queue/contentFinished/tasks');
     queue.push({'userId': userObject.uid, 'contentId': id}).then(function(){
       //starts server request to watch content
       return;
     })
  }
  function seekerWatch(videoEle){
    videoEle.addEventListener('seeking', function(){
      videoEle.exitFullScreen();
      location.reload();
      return;
    })

  }
  function volumeWatch(videoEle){
    videoEle.addEventListener('volumechange', function(){

      exitFullScreenBrowser();
      location.reload();
      return;

    })
  }
  function restartVideo(videoEle){
    // videoEle.
  }
  function createViewModalWindow(data, id, contentData, modal){
    //stage 1 watch video
    //stage 2 click link
    //stage 3 answer feedback
    //stage 3 thumbs up or down
    //payout -into completion
    //screen fuctionality

    let videoEle = modal.children[2].children[1];
    var currentTime;
    const duration = videoEle.duration;
    var internalTime = false;
    var screenExitCount = 0;
    var vidVolume;
    //sets src to video element and other elements needed to watch video
    videoEle.setAttribute('src', data.source.link)
    //hides content banner
    modal.children[2].childNodes[1].style.display = 'none';
    //show video
    videoEle.style.display = 'block';
    //play video and enter full screenOn
    // videoEle.webkitRequestFullScreen();
    // videoEle.play();

    //starts server queue to track progress
    var queue = firebaseDataBase.ref('/queue/contentStart/tasks');
    queue.push({'userId': userObject.uid, 'contentId': id}).then(function(){
      //starts server request to watch content
      return;
    })
    //watch for volume change
    // console.log('inital volume', videoEle.volume)

    // console.log('volume change occured', videoEle.volume);
    //


    // setTimeout(function(){
    //   //queue
    //   internalTime = true;
    // }, (duration * 100))
    // document.onwebkitfullscreenchange = function(event){
    //   event.preventDefault();
    //   screenExitCount += 1;
    //   currentTime = videoEle.currentTime;
    //
    //   if((screenExitCount % 2 == 0) && currentTime < duration){
    //     console.log(currentTime, duration)
    //     screenOn = false;
    //
    //     console.log(screenOn, 'working')
    //     videoEle.style.display = 'none';
    //     videoEle.pause();
    //     modal.children[2].childNodes[1].style.display = 'block';
    //     // alert('Please do not exit full screen, restart from the beggining!')
    //   }
    //   else if((screenExitCount % 2 == 0) && currentTime === duration && internalTime){
    //     event.preventDefault();
    //     var queue = firebaseDataBase.ref('/queue/contentFinished/tasks');
    //     queue.push({'userId': userObject.uid, 'contentId': id}).then(function(){
    //       //starts server request to watch content
    //       return;
    //     })
    //     console.log(currentTime, duration)
    //     // alert('thanks for watching next step!')
    //     videoEle.style.display = 'none';
    //     //check to see what else is required for completion
    //   }
    // }
    // videoEle.webkitOnFullScreenChange = function(){\
    //   console.log('exit of full screen')
    //   videoEle.pause();
    // }
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

  function alertUser(action){
    alert(
      action
    )
  }
})
