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

    db.ref('tag/' + data.userId).once('value', function(snapshot){
      var tagData = snapshot.val();
      console.log(data);
      if(!tagData){
        db.ref('tag/' + data.userId).push({data: tag}).then(function(res){
          resolve();
        })
      }
      if(tagData){
        if(tagData.length > 5){
          resolve();
        }
        var count = 0;
        for(var i in tagData){
          count += 1;
          if(count >= 5){
            resolve();
          }
          var temp = tagData[i].data
          console.log(temp, data.data);
          if(temp == data.data){
            resolve();
          }
          db.ref('tag/' + data.userId).push({data: tag}).then(function(res){
            resolve();
          })
        }
      }
    })



});
var getTagsRef = admin.database().ref('/queue/getTags/');
var queue = new Queue(getTagsRef, function(data, progress, resolve, reject) {
  // console.log(data)
  var tag = data.data

    db.ref('tag/' + data.userId).once('value', function(snapshot){
      if(snapshot.val()){
        for(var i in snapshot.val()){
          console.log(snapshot.val()[i])
        }
      }
    })

});


module.exports = router;
