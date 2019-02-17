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
  // console.log('checking time on video')
  var time = new Date().getTime();
  db.ref('content/' + data.userId + '/contentList/' + data.contentId)
  .once('value', function(childData){
    var timeElapsed = ((time - childData.val().progress.video.time) / 1000) //changes time into seconds
    console.log(timeElapsed, childData.val().videoLength, 'is mobile ' + data.mobile)
    console.log(childData.val().videoLength - timeElapsed)
    if(data.mobile === true){
      var timeDiffernce = 3;
    }else{
      var timeDiffernce = 1;
    }
    console.log('timediffernce, ', timeDiffernce)
    if(childData.val().videoLength - timeElapsed < timeDiffernce){ //if the time difference is less than 1 second
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

var contentFinishedTask = admin.database().ref('/queue/linkTimer/');
var queue = new Queue(contentFinishedTask, function(data, progress, resolve, reject) {
  //gets timer from server than waits before resolving
  db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/link/')
    .once('value', function(childData){
      if(childData.val().linkTime){
        var time = childData.val().linkTime * 1000;
        setTimeout(function(){
          db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/link/')
          .update({'status': true}).then(function(){
            resolve();
          })
        }, time)
      }
      else{
        db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/link/')
        .update({'status': true}).then(function(){
          resolve();
        })
      }
    })
})
var contentFinishedTask = admin.database().ref('/queue/answerClick/');
var queue = new Queue(contentFinishedTask, function(data, progress, resolve, reject) {
  db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/answer/')
  .once('value', function(childData){
    db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/answer/')
    .update({'status': true, 'data': data.data}).then(function(){
      resolve();
    })
  })
})
var contentFinishedTask = admin.database().ref('/queue/finishContent/');
var queue = new Queue(contentFinishedTask, function(data, progress, resolve, reject) {
  db.ref('content/' + data.userId + '/contentList/' + data.contentId)
  .once('value', function(childData){
    if(childData.val().progress.answer.status && childData.val().progress.link.status && childData.val().progress.video.status){
      db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/loader/')
      .update({'show': true}).then(function(){
        setTimeout(function(){
          db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/loader/')
          .update({'show': false})
            .then(function(){
              db.ref('publishedContent/' + childData.val().author + '/' + data.contentId)
              .once('value', function(snapshotData){
                var currentEscrowAmount = snapshotData.val().paymentInfo.escrow;
                db.ref('publishedContent/' + childData.val().author + '/' + data.contentId + '/' + 'paymentInfo')
                .update({'escrow': currentEscrowAmount - childData.val().payout})
                .then(function(){
                  db.ref('contentReceipts/' + childData.val().author + '/' + data.contentId + '/' + data.userId)
                  .update({
                    'payout': childData.val().payout,
                    'data': childData.val().progress.answer.data,
                    'matchPercentage': childData.val()['match%']
                  })
                  .then(function(){
                    console.log('recipt saved, next function active')
                    db.ref('internalBalance/' + data.userId)
                    .once('value', function(balanceData){
                      var internalBalance = balanceData.val();
                      console.log(internalBalance.balance, childData.val().payout)

                      db.ref('internalBalance/' + data.userId)
                        .update({'balance': parseInt(internalBalance.balance) + parseInt(childData.val().payout)})
                        .then(function(){
                          db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/receipt/').update({'status': 'true'})
                          .then(function(){
                            resolve();
                          })
                        })
                    })
                  })
                })
            })
          })
        }, Math.random() * (3000-1000) + 1000)
      })
    }
    else{
      reslove();
    }
  })
})

module.exports = router;
