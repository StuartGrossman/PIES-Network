var express = require('express');
var router = express.Router();
var request = require('request');
var Web3 = require('web3');
var web3 = new Web3();
var http = require('http');
var fs = require('fs');
var download = require('download-file');
var EthContract = require('ethjs-contract');
var Queue = require('firebase-queue');
var admin = require('firebase-admin');
var db = admin.database();
//function starts watching process, sets a timer in the database to compare to later
var contentStartTask = admin.database().ref('/queue/contentStart/');
var queue = new Queue(contentStartTask, function(data, progress, resolve, reject) {
  // console.log('content viewing of '+ data.contentId + '  starting')
  var time = new Date().getTime();
  db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/video').update({'time': time}).then(function(){
    resolve();
  })
});

//function cofirms that the content was watched
var contentFinishedTask = admin.database().ref('/queue/contentFinished/');
var queue = new Queue(contentFinishedTask, function(data, progress, resolve, reject) {
  console.log('checking time on video')
  var time = new Date().getTime();
  db.ref('content/' + data.userId + '/contentList/' + data.contentId)
  .once('value', function(childData){
    var timeElapsed = ((time - childData.val().progress.video.time) / 1000) //changes time into seconds
    console.log(timeElapsed, childData.val().videoLength)
    console.log(childData.val().videoLength - timeElapsed)

    if(childData.val().videoLength - timeElapsed < 1){ //if the time difference is less than 1 second
      db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/video/')
      .update({'status' : true}).then(function(){
        db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/loader/')
        .update({'show' : true}).then(function(){
          setTimeout(function(){
            db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/loader/')
            .update({'show' : false}).then(function(){
              resolve();
            })
          }, 2500)
        })
      })
    }else{
      resolve();
    }
  })
});



module.exports = router;
