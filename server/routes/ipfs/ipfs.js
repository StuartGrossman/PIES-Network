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
var Web3 = require('web3');
var web3 = new Web3();
var exec = require('promise-exec');

var Eth = require('ethjs-query');
var EthContract = require('ethjs-contract');
// var HumanStandardToken = require('./contract.json');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
// console.log("in promise exec");
// var exec = require('promise-exec');
//
// exec('ls -al')
//   .then(function(result) {
//     console.log(result);
//   })
//   .catch(function(err) {
//     console.error(err);
//   });

// promiseExec("test").then((output) => {
//     return new Promise((resolve, reject) => {
//       console.log("in promise exec");
//       // tmpFilePath = output.replace("\n", "")
//       // let manifestContents = fs.readFileSync("config/prod/container_manifest.yaml").toString()
//       // manifestContents.replace("%%GCLOUD_PROJECT_ID%%", process.env.BACKEND_GCLOUD_PROJECT)
//       // fs.writeFileSync(tmpFilePath, manifestContents)
//       resolve()
//     })
//   }).then(() => {
//     // return promiseExecEach([
//     //
//     // ])
//   })

// promiseExec("test").then(function(err, res){
//   console.log("worked in the promsie")
// })
var ipfsRef = admin.database().ref('/queue/ipfs/');


var queue = new Queue(ipfsRef, function(data, progress, resolve, reject) {
  var asyncWaitTime = (data.duration * 100) + 1000;
  var file = data.userId  + '.mp4'
  var ipfsDocker = ' 04f0f51384ee ';
  var options = {
      directory: "./temp",
      filename: file
  }

  // console.log(asyncWaitTime, "async wait time",  data.duration + " duration ")
  // console.log(data.duration * 10)
  console.log(data);

  download(data.downloadURL, options, function(err){
      if (err){
        throw err
      }

      // exec('cd temp/; tar -cv * | docker exec -i' + ipfsDocker + 'tar x -C /var/tmp/; docker exec -i' + ipfsDocker + 'ipfs add /var/tmp/' + file)
      //   .then(function(result) {
      //     console.log(result);
      //     var r = result[0].split(' ')
      //     var ipfsHash = r[1]
      //     console.log(ipfsHash)
      //     var ref = admin.database().ref('user/' + data.userId + '/ads/');
      //     ref.push({
      //       "ipfsHash": ipfsHash
      //     })
      //
      //   }).then(function(res){
      //     exec('docker exec -i' + ipfsDocker + 'rm -rf /var/tmp/' + file).then(function(res){
      //       console.log(res)
      //     })
      //   })

      //LOCAL IMPLEMNTATION
      exec('ipfs add temp/' + file)
        .then(function(result) {
          console.log(result);
          var r = result[0].split(' ')
          var ipfsHash = r[1]
          console.log(ipfsHash)
          var ref = admin.database().ref('user/' + data.userId + '/ads/');
          ref.push({
            "ipfsHash": ipfsHash
          })

        }).then(function(res){
          console.log("pushed hash" + ipfsHash)
        })

  })
  setTimeout(function() {
    // exec('rm -rf ./temp/' + file).then(function(res){
      // console.log(res);
      console.log("queue resolved!")
      resolve();

    // })

  }, asyncWaitTime)
})
// var dB = admin.database()
// function linkUsers(tagListArray){
//   var userRef = db.ref('/user/')
//   userRef.on()
// }

module.exports = router;
