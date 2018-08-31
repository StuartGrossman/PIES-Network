var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var Queue = require('firebase-queue');
var admin = require('firebase-admin');
var db = admin.database();


var addTagsRef = admin.database().ref('/queue/addTags/');
var queue = new Queue(addTagsRef, function(data, progress, resolve, reject) {
  db.ref('tags/' + data.userId).once('value', function(snapshot){
    if(snapshot.val()){
      snapshot.forEach(function(childSnapshot) {
        if(data.tag === childSnapshot.val()){
          db.ref('tags/' + data.userId).child(childSnapshot.key).remove().then(function(res, err){
            // console.log('deleting data');

            resolve();
          })
        }
      })
      db.ref('tags/' + data.userId).push(data.tag).then(function(res, err){
        // console.log('searched Data for duplicate, none found, added tag')
        if(err){
          reject();
        }
        resolve();
      })
    }else{
      db.ref('tags/' + data.userId).push(data.tag).then(function(res, err){
        // console.log('no data found, added tag')
        if(err){
          reject();
        }
        resolve();
      })
    }
  })

});



var checkTagsRef = admin.database().ref('queue/checkTags/');
var queue = new Queue(checkTagsRef, function(data, progress, resolve, reject) {
  var tag = data.tag


});

// var getTagsRef = admin.database().ref('/queue/getTags/');
// var queue = new Queue(getTagsRef, function(data, progress, resolve, reject) {
//   // console.log(data)
//   var tag = data.data
//
//     db.ref('tag/' + data.userId).once('value', function(snapshot){
//       if(snapshot.val()){
//         for(var i in snapshot.val()){
//           console.log(snapshot.val()[i])
//         }
//       }
//     })
//
// });


var getPersonalDataRef = admin.database().ref('/queue/personalData/');
var queue = new Queue(getPersonalDataRef, function(data, progress, resolve, reject) {
  var updateData = {};
  updateData[data.dataName] =  data.data;
  admin.database().ref('userData/' + data.userId).update(updateData).then(function(res, err){
    if(err){
      reject();
    }
    resolve();
  })


});

module.exports = router;
