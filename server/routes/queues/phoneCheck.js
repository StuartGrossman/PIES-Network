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
var accountSid = 'AC3e2df9fed2db47dcaec4d7c82131cd9e'; // Your Account SID from www.twilio.com/console
var authToken = 'f00cec38dae1219a9dc0d60fcdc21890';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

////
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var phoneRef = admin.database().ref('/queue/phone/');
var confirmPhoneRef = admin.database().ref('/queue/confirmPhone/tasks');

var queue = new Queue(phoneRef, function(data, progress, resolve, reject) {
  var code = getRandomInt(1000, 9999)
  db.ref('user/' + data.uid + '/phone/').set({'code': code});
  client.messages.create({
      body: 'Hello from PIES Network, your code is ' + code,
      to: '+1' + data.phone,  // Text this number
      from: '+14157636376 ' // From a valid Twilio number
  })
  .then(function(message){
    console.log(message.sid)
    resolve();
  });
})
var queue = new Queue(confirmPhoneRef, function(data, progress, resolve, reject) {
  var code = getRandomInt(1000, 9999)
  db.ref('user/' + data.uid + '/phone/').set({'code': code});
  client.messages.create({
      body: 'Hello from PIES Network, your code is ' + code,
      to: '+1' + data.phone,  // Text this number
      from: '+14157636376 ' // From a valid Twilio number
  })
  .then(function(message){
    console.log(message.sid)
    resolve();
  });
})



module.exports = router;
