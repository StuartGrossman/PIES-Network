var express = require('express');
var router = express.Router();
var request = require('request');
var Web3 = require('web3');
var web3 = new Web3();
var http = require('http');
var fs = require('fs');
var download = require('download-file');
// var Eth = require('ethjs-query1');
var EthContract = require('ethjs-contract');
var Queue = require('firebase-queue');
var admin = require('firebase-admin');
var db = admin.database();

//// queue refs
// var userDataRef = admin.database().ref('/queue/userData/task');
////
//// Task for adding User data
// var queue = new Queue(userDataRef, function(data, progress, resolve, reject) {
//   console.log(data);
//   db.ref('/tags/' + data.uid )
// });

//// queue refs
// var userTypeRef = admin.database().ref('/queue/userType/task');
////
//// Task for adding User data
// var queue = new Queue(userTypeRef, function(data, progress, resolve, reject) {
//
// });
var termsRef = admin.database().ref('/queue/terms/');
var queue = new Queue(termsRef, function(data, progress, resolve, reject) {
  console.log(data)
  if(data.signed){
    db.ref('terms/' + data.userId).set({'confirmed': true}).then(function(){
      resolve();
    });
  }
});

var user99Ref = admin.database().ref('/queue/usertype99/');
var queue = new Queue(user99Ref, function(data, progress, resolve, reject) {
  console.log(data)
    db.ref('usertype/' + data.userId).set({'type': 99}).then(function(){
      resolve();
    });
});

var user10Ref = admin.database().ref('/queue/usertype10/');
var queue = new Queue(user10Ref, function(data, progress, resolve, reject) {
  console.log(data)
    db.ref('usertype/' + data.userId).set({'type': 10}).then(function(){
      resolve();
  });
});


module.exports = router;
