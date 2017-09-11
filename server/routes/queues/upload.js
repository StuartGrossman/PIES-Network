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
var gcloud = require('google-cloud');
var gcs = gcloud.storage({
  projectId: 'x-goog-project-id: 129227170241',
  keyFilename: './serviceAccountKey.json'
});
////
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var phoneRef = admin.database().ref('/queue/phone/');
var confirmPhoneRef = admin.database().ref('/queue/confirmPhone/tasks');
var bucket = gcs.bucket('adspace-9fe5c.appspot.com');
var remoteFile = bucket.file('test.mp4');
var localFilename = '/Users/Stu/Desktop/test.mp4';



var uploadRef = admin.database().ref('/queue/uploadContent/tasks');

var queue = new Queue(uploadRef, function(data, progress, resolve, reject) {
  bucket.upload(localFilename, function(err, file) {
    if (!err) {
      console.log('somefile-inThisCaseASong.mp3 is now in your bucket.');
    } else {
      console.log('Error uploading file: ' + err);
    }
  });
})


module.exports = router;
