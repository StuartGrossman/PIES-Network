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


var tagsRef = admin.database().ref('/queue/addTags/');
var queue = new Queue(tagsRef, function(data, progress, resolve, reject) {
  // console.log(data)
  var tag = data.data

    db.ref('tag/' + data.userId).push({data: tag}).then(function(res){
      resolve();
    })

});



module.exports = router;
