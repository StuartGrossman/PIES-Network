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

////generates random code
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//sends code
var phoneRef = admin.database().ref('/queue/phone/');
var withdrawPhoneCheckRef
//checks code
var checkPhoneCodeRef = admin.database().ref('/queue/confirmPhone/');
var withdrawPhoneCheckRef = admin.database().ref('/queue/withdrawPhoneCheck/');
//confirms code

var confirmCodeRef = admin.database().ref('/queue/confirmCode/');


var queue = new Queue(withdrawPhoneCheckRef, function(data, progress, resolve, reject) {
  db.ref('phone/' + data.userId).once('value', function(snapshot){
    var phone = snapshot.val().phone
    // console.log(code, data.code)
    if(phone){
      db.ref('/queue/phone/tasks').push({'userId': data.userId, 'phone': phone, 'message': 'Your PIES Token withdrawl code is '});
    }
  })

  .then(function(message){
    resolve();
  });
})





// function for checking server time aginst last phone send. This function is to disable any one user from sending to many phone request to the server

function checkTime(item, userId){
  db.ref('phoneAttempts/' + userId + '/serverTime').set({'time': new Date().getTime() / 1000}).then(function(res){
    setTimeout(function(){
      db.ref('phoneAttempts/' + userId + '/serverTime').once('value', function(snapshot){
        if(snapshot.val()){
          var serverTime = snapshot.val().time
          var differnce = serverTime - item.time
          console.log(serverTime, item.time)
          console.log(differnce)
          if(differnce > 600){
            return true;
          }
        }
        else{
          return false;
        }
      })

    }, 1000)

  })

}

var queue = new Queue(phoneRef, function(data, progress, resolve, reject) {
  var code = getRandomInt(10000, 99999)
  // console.log('hitting phone Ref', data)
  db.ref('phoneAttempts/' + data.userId).once('value', function(snapshot){
    var currentData = snapshot.val();
    if(!currentData){
      console.log('hitting no data in attempts')
      db.ref('phoneAttempts/' + data.userId).push({'time': new Date().getTime() / 1000});
      db.ref('phone/' + data.userId).update({'code': code, 'phone': data.phone});
      if(data.message){
        client.messages.create({
            body: data.message + code,
            to: '+1' + data.phone,  // Text this number
            from: '+14157636376 ' // From a valid Twilio number
        }).then(function(message){
        //   console.log(message.sid)
          resolve();
        });
      }else{
        client.messages.create({
            body: 'Welcome to PIES Network, your code is ' + code,
            to: '+1' + data.phone,  // Text this number
            from: '+14157636376 ' // From a valid Twilio number
        }).then(function(message){
        //   console.log(message.sid)
          resolve();
        });
      }
    }
    // console.log(data)
    if(currentData){
      // console.log(currentData)
      //checks to make sure there is data
      var temp = 0;

      var lastItem;

      for(var i in currentData){
        temp += 1
        //temp is equal to the number of attempts to send code
        //sets lastItem to lastItem in timestet of Data
        lastItem = currentData[i];
        // console.log(lastItem)
      }
      if(temp <= 1){
        console.log(temp, "this is the ammount of phone attempts")

        console.log('hitting less than 3 attempts')

        db.ref('phoneAttempts/' + data.userId).push({'time': new Date().getTime() / 1000});
        //adds Timestamp for code Send
        db.ref('phone/' + data.userId).update({'code': code, 'phone': data.phone});
        if(data.message){
          client.messages.create({
              body: data.message + code,
              to: '+1' + data.phone,  // Text this number
              from: '+14157636376 ' // From a valid Twilio number
          }).then(function(message){
            console.log(message.sid)
            resolve();
          });
        }else{
          client.messages.create({
              body: 'Welcome to PIES Network, your code is ' + code,
              to: '+1' + data.phone,  // Text this number
              from: '+14157636376 ' // From a valid Twilio number
          }).then(function(message){
            console.log(message.sid)
            resolve();
          });
        }

      }
      else if(temp >= 1){
        console.log(temp, "this is the ammount of phone attempts")

        //if attempts are over 3, check the last timestamp against current time
        console.log(lastItem, 'this is being passed to the checkTime function')
        var time = checkTime(lastItem, data.userId);
        setTimeout(function(){
          if(time){
            console.log('attempts maxed out but time is true')

            //if time resloves to true than differnce of time stamps is sufficent to send new text
            db.ref('phone/' + data.userId).update({'code': code, 'phone': data.phone});
            client.messages.create({
                body: 'Welcome to PIES Network, your code is ' + code,
                to: '+1' + data.phone,  // Text this number
                from: '+14157636376 ' // From a valid Twilio number
            })
            .then(function(message){
              console.log(message.sid)
              resolve();
            });
          }else{
            // console.log('server must wait before sending new text!')
            //if its false resolve the queue
            resolve();
          }
        }, 1000);
      }

    }
  })

})





//Checks Phone Code
var queue = new Queue(checkPhoneCodeRef, function(data, progress, resolve, reject) {
  db.ref('phone/' + data.userId).once('value', function(snapshot){
    var code = snapshot.val().code
    console.log(code, data.code)
    if(data.code === code.toString()){
      db.ref('/queue/confirmCode/tasks').push({'userId': data.userId})
    }
  })

  .then(function(message){
    resolve();
  });
})

//Confirms Phone Code
var queue = new Queue(confirmCodeRef, function(data, progress, resolve, reject) {
  db.ref('phone/' + data.userId).update({
    'confirmed': true
  })

  .then(function(message){
    console.log('confirmed True!');
    resolve();
  });
})





module.exports = router;
