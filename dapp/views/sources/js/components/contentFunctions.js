var contentFunctions = (function(userObject, firebaseDataBase){
  'use-strict';

  //Content Functions sheet contains a majority of the front end logic for PIES NETWORK Viewer dashboard
  //This Page takes all the content in a users database translates it into html
  //It contains the functions that check the progress of the watching content
  //Ideally this file will be refactored into several different files
  //Complex frontend logic in vanilla javascript is amazing

  //Function to check what type of device page is being accessed on
  var isMobile = false; //initiate as false
// device detection
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
      isMobile = true;
  }
  console.log(isMobile)
  //Function evaluates progress and hits loader() removes content if progress is not completed
  this.watchForLoad = function watchForLoad(){
    firebaseDataBase.ref('progressBar/' + userObject.uid).on('value', function(progressData){
      var progress = progressData.val().progress;
      if(progress != 100){
        //If progress is not 100 remove content viewing and child nodes
        deleteChildNodes();
      }
      else{
        document.getElementById('contentContainer').style.display = 'block';

        contentFunctions.load();
      }
    })
  }
  //Logic speration ; used above
  function deleteChildNodes(){
    document.getElementById('contentContainer').style.display = 'none';
    var myNode = document.getElementById('contentHolder');
    //removes all child elements of a node
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
  }

  //function watchs for loader, if the watcher is true open loader modal, close when false
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
  //Load function takes all content and creates html canvas along with custom ids for each cntent item unwatched by user
  //Watchs for state changes on content items
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

          alertCount += 1; //alert count
          var lookup = data.contentList[i].lookup
          watchLoader(lookup) //calls watchLoader on the id of the content element, each item gets its own watcher
          //opens Database looking for the the original published item through its authors UID and its Content UID
          firebaseDataBase.ref('publishedContent/' + data.contentList[i].author)
           .once('value', function(contentData){
             //Opens all publishers content
             //If any content is there proceed
            if(contentData.val()){

              var publishedItem = contentData.val()[lookup]; //current item being selected. lookup is the contents specific UID
              var dataId = data.contentList[i].author;
              var contentElementLink = document.createElement('a');
              //creates button for opening the modal -- /publishedData/userId/ lookup
              //Uses the published item ID as the pointer in the elements own id

              contentElementLink.addEventListener('click', function(){
                contentElementLink.setAttribute('data-toggle', 'modal');
                contentElementLink.setAttribute('data-target', '#' + lookup + 'Modal');
                contentElementLink.setAttribute('id', 'open' + lookup + 'Modal');
              })
              // console.log(contentData.val()[lookup], lookup, data)
              contentElementLink.innerHTML = publishedItem.productInfo.title;
              //create new List item append contentElement
              var contentEle = document.createElement('li');
              contentEle.appendChild(contentElementLink);

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
    //sets header of the modal
    // percentage of match, payment ammount
    var modalHeaderContent =
    data.productInfo.title + '  |  '
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

    //sets image
    modalBody.children[2].childNodes[1].setAttribute('src', data.source.capta);

    //sets warning aginst false information
    modalBody.childNodes[7].children[0].children[0].innerHTML =
    '<p style="font-size: 10px; text-align:justify;"> By clicking this button you agree to watch this content with engadment and to give accurate feed back. Changing the volume, or skipping will restart this process. Intentionally trying to break these rules can result in an account suspension or ban.</p><br><p style="font-size: 10px; text-align:justify;">If you are on mobile you have 5 seconds to start the video from time of pressing this button</p>';


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
        videoEle.volume = 0.1;

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
    console.log('second stage launch')
    // var blankModal = document.getElementById('blankModalResponse').cloneNode(true);
    // blankModal.id = id + 'Modal'
    // var modalBody = blankModal.childNodes[1].childNodes[1]
    // //sets title percentage and payment ammount
    // var modalHeaderContent = data.productInfo.title + '  |  '
    // + '<span style="font-size:12px">'
    // +  data.productInfo.info +'</span>' +  ' | '
    // + '<span style="color:#fb9678; opacity: 0.8"> '
    // + currentContent.payout +'</span>'
    // + '<span style="font-size:12px; color:#fb9678; opacity:0.75">'
    // + ' PIES' + '</span>';
    //
    // modalBody.childNodes[1].children[1].childNodes[1].innerHTML = modalHeaderContent;
    // //setting match percentage
    // var tempTagEle = tagEle.cloneNode(true);
    //
    // matchPercentage = '<span style="font-size:12px">'
    // + currentContent["match%"]
    // + '%' + ' Match' + '</span>';
    // tempTagEle.innerHTML = matchPercentage
    //
    // tempTagEle.classList.add('btn-danger')
    //
    // modalBody.children[1].appendChild(tempTagEle)
    // //sets tags and userData
    // setDataTags(currentContent.tags, modalBody);
    // setDataTags(currentContent.userData, modalBody);
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
