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
  db.ref('tag/' + data.userId).set(data.data).then(function(res){
    resolve();
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

var getBrandTags = admin.database().ref('/queue/addBrandTags/');
var queue = new Queue(getBrandTags, function(data, progress, resolve, reject) {
  // console.log(data)

  // query tag/id/brands
  admin.database().ref('/tag/' + data.userId + '/brands/').once('value', function(snapshot){
    if(snapshot.val()){
      console.log(data)
      // if the data exists do check
      var matchFlag = false;
      var tagKey;
      snapshot.forEach(function(childSnapshot) {
        var childKey = childSnapshot.key;
        var childData = childSnapshot.val();
        // console.log(childKey, childData)
        // ...
        if(childData == data.data){
          tagKey = childKey;
          matchFlag = true;
          // console.log('hitting delete')
        }
      });
      if(matchFlag){
        db.ref('tag/' + data.userId + '/brands/' + tagKey).remove();
        resolve('deleted Brand');
      }else{
        db.ref('tag/' + data.userId + '/brands/')
        .push(data.data)
        .then(function(result){
          resolve('added New Brand');
        });
      }
      // setTimeout(function(){
      //   console.log('wtf')
      //   db.ref('tag/' + data.userId + '/brands/').push(data.data).then(function(result){
      //      resolve();
      //   })
      // }, 1000)

    }else{
        //NO data found at url so add brand
        db.ref('tag/' + data.userId + '/brands/').push(data.data).then(function(result){
           resolve('no datafound added new brand');
        })
      }
  })
  // run loop on data and check every brand against data.data
  // if the brand already exists remove it
  // if the brand does not exist add it
  // resolve



  // db.ref('tag/' + data.userId + '/brands/').push(data.data).then(function(result){
  //   resolve();
  // })
});
var getTagsRef = admin.database().ref('/queue/personalData/');
var queue = new Queue(getTagsRef, function(data, progress, resolve, reject) {
  var updateData = {};
  updateData[data.dataName] =  data.data;
  admin.database().ref('userData/' + data.userId).update(updateData).then(function(err, res){
    if(err){
      reject();
    }
    resolve();
  })


});

module.exports = router;
