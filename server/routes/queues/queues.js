var express = require('express');
var router = express.Router();
var request = require('request');
var Web3 = require('web3');
var web3 = new Web3();
var Eth = require('ethjs-query')
var EthContract = require('ethjs-contract')
var Queue = require('firebase-queue');
var admin = require('firebase-admin');
var db = admin.database();


///EXAMPLE TO FOLLOW!
//////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
var updateBillRef = db.ref('firebase-queue/bill-queue/'); //state the refernce with good var name, make sure your url is not already being used!
var updateBillQueue = new Queue(updateBillRef,  function(data, progress, resolve, reject){
///// STATE THE RULES
  //UPDATE Bill QUEUE RULES
    // User must be authenticated
    // title must be at least 20 charecters no more than 80
    // discription must be at least 30 charecters no more than 500
    // body must be at least 100 charecters no more than 5000
  db.
  db.billRef().update(data.bill).than(function(){
    resolve("Bill Updated");
  });
})



router.get('/', function(req, res){
  console.log("route being hit")
  // var postId = "2"
  // var starCountRef = admin.database().ref('users/' + postId + '/starCount');
  // starCountRef.on('value', function(snapshot) {
  //   updateStarCount(postElement, snapshot.val());
  // });



  // var options = {
  // 'specId': 'spec_1',
  // 'numWorkers': 5,
  // 'sanitize': false,
  // 'suppressStack': true
  // };


})
var ref = admin.database().ref('queue');

var queue = new Queue(ref, function(data, progress, resolve, reject) {
// Read and process task data
console.log(data);

// Do some work
progress(50);

// Finish the task asynchronously
setTimeout(function() {
  resolve();
}, 1000);
});

module.exports = router;
