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


var fakeData = {
  "234141": {"data": "soccor"},
  "123123": {"data": "pie"},
  "1329132": {"data": "running"}
                }

function linkUsers(tagList){
  console.log("inside linkUsers", tagList)
  var userRef = db.ref('/tags/')
  userRef.on('value', function(snapshot){
    var data = snapshot.val();
    var ammount = 0;

    for( var i in data){
      var catchTags = false;

      for( var k  in data[i]){
        var tempTag = data[i][k].data;

        for( var j in fakeData ){
          // console.log("checking", tempTag + "vs" + fakeData[j].data)

          if(tempTag === fakeData[j].data){
            console.log(fakeData[j].data)
            catchTags = true;
          }
        }
      }
      //adds the userCount
      if(catchTags){
        ammount += 1;
      }
    }
    console.log(ammount)
  })
}
// linkUsers(fakeData);

module.exports = router;
