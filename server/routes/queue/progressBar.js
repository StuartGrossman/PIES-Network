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

var progressBarRef = admin.database().ref('/queue/progressBar/');
var queue = new Queue(progressBarRef, function(data, progress, resolve, reject) {
  // console.log(data.userData, data.tagData);
  tagProgress = (data.tagData * 10);
  userDataProgress = (data.userData * (100/12));
  if(tagProgress >= 100){
    tagProgress = 100;
  }
  if(userDataProgress >= 100){
    userDataProgress = 100;
  }
  var total = (userDataProgress + tagProgress)/2;
  // console.log(total);
  if(total >= 100){
    // console.log('total is above 100');
    db.ref('user/' + data.userId).update({progress: true}).then(function(){
      db.ref('progressBar/' + data.userId).update({'progress': 100}).then(function(){
        resolve();
      })
    })
  }
  else{
    db.ref('progressBar/' + data.userId).update({'progress': total}).then(function(){
      resolve();
    })
  }
});

var freeTokenRef = admin.database().ref('/queue/freeTokens/');
var queue = new Queue(freeTokenRef, function(data, progress, resolve, reject) {
  db.ref('progressBar/' + data.userId).once('value', function(snapshot){
    if(snapshot.val().freeTokenClaimed === false){
      db.ref('internalBalance/' + data.userId).once('value', function(childSnapshot){
        var internalBalance = childSnapshot.val().balance;
        internalBalance += 1000;
        db.ref('internalBalance/' + data.userId).update({'balance': internalBalance}).then(function(res){
          db.ref('progressBar/' + data.userId).update({'freeTokenClaimed': true}).then(function(res){
            resolve();
          })
        })
      })
    }
    else{
      resolve();
    }
  })
});

module.exports = router;
