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

var contentStartTask = admin.database().ref('/queue/contentStart/');
var queue = new Queue(contentStartTask, function(data, progress, resolve, reject) {
  console.log('content viewing of '+ data.contentId + '  starting')
  var time = new Date().getTime();
  db.ref('content/' + data.userId + '/contentList/' + data.contentId + '/progress/video').update({'time': time}).then(function(){
    resolve();
  })

  console.log(data);

});
var contentFinishedTask = admin.database().ref('/queue/contentFinished/');
var queue = new Queue(contentFinishedTask, function(data, progress, resolve, reject) {
  var time = new Date().getTime();
  db.ref('content/' + data.userId + '/contentList/' + data.contentId).once('value', function(data){
    console.log(data.val().progress.video.time)
    // if(time - data.val().time > )
  }).then(function(){
    resolve();
  })

  console.log(data);
  // db.ref
});



module.exports = router;
