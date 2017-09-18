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
var Web3 = require('web3');
var web3 = new Web3();
var exec = require('promise-exec');

//// queue refs
var userDataRef = admin.database().ref('/queue/userData/task');
////
//// Task for adding User data
var queue = new Queue(userDataRef, function(data, progress, resolve, reject) {
  console.log(data);
  db.ref('/tags/' + data.uid )
});

//// queue refs
var userTypeRef = admin.database().ref('/queue/userType/task');
////
//// Task for adding User data
var queue = new Queue(userTypeRef, function(data, progress, resolve, reject) {
  
});




module.exports = router;
