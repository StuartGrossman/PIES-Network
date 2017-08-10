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
var HumanStandardToken = require('./contract.json');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase, function(err, res){
  // console.log(balance)
});
// var web3_token = web3.eth.contract(HumanStandardToken).at('0xf5a058b428c04d6ebec97aa774cf65c528da4344');
// var account = web3.eth.accounts[0];
// console.log(account)
// web3_token.totalSupply.call({from: account}, function(err, totalSupply) {
//           console.log(totalSupply);
//           // that.setState({totalSupply: totalSupply.toString()});
//
//           //a check that if the address returns 0 here, it's either invalid or not usable and user gets notified.
//           if(totalSupply.toString() === "0") {
//             that.setState({valid: false});
//           }
//       });
//
//       console.log(web3_token)
// web3_token.transfer.call({"from": '0xc969238d0ec056847318e2e5164fa6c32984431b', "to": "0xf5a058b428c04d6ebec97aa774cf65c528da4344", "value": 1e18}, function(err, result){
//   console.log(result)
// })
//eth_gasPrice
//eth_estimateGas
//getTransactionCount
//eth_sendRawTransaction


// router.get('/', function(req, res){
//   console.log("route being hit")
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


// })
var token = web3.eth.contract(HumanStandardToken).at('0x7d205a1C6F4CD650E89eE3A3E200153EFbf4442E');
var account = web3.eth.accounts[0];
var account2 = web3.eth.accounts[1];
// var account = web3.personal.accounts[0];
// main account '0x541e8e0b0f25f799f941932ddcb93bb83d254e64'
console.log("this is the main account::" + account, "secount account " + account2)
// web3_token.personal.unlockAccount(account,"password",15000); // unlock for a long time
//
function testTransaction(){
  // web3.eth.defaultAccount = web3.eth.accounts[0]


  // token.transfer(account2, 100);
  totalSupply = token.totalSupply();
  console.log(token + "this is the token", "total supply = " + totalSupply)


  var callData = token.transferFrom.getData(account, account2, 100);
  console.log(callData)
  var postData = {"jsonrpc":"2.0","method":"eth_call","params": [{"from": account, "to": '0xc969238d0eC056847318e2E5164fa6C32984431b', "data": callData}], "id":1}
      var url = 'http://localhost:8545/'
      var options = {
        method: 'post',
        body: postData,
        json: true,
        url: url
      }
      request(options, function (err, res, body) {
        if (err) {
          console.error('error posting json: ', err)
          throw err
        }
        var headers = res.headers
        var statusCode = res.statusCode
        console.log('headers: ', headers)
        console.log('statusCode: ', statusCode)
        console.log('body: ', body)
      })
  // token.transfer(account2, 100, function(err, res){
  //   console.log(err, res)
  //   if(res){
  //     console.log("success")
  //
  //   // }
  // });
  console.log(token.balanceOf(account) + " tokens balance")
  console.log(token.balanceOf(account2) + " tokens balance of account2")
}
testTransaction();
//// queue refs
var ethSetupRef = admin.database().ref('/queue/eth_setup');
var ipfsRef = admin.database().ref('/queue/ipfs/');
////

var queue = new Queue(ethSetupRef, function(data, progress, resolve, reject) {
  // Read and process task data
  console.log(data);
  // curl -d '{"jsonrpc":"2.0","method":"eth_sendTransaction","params": [{"from":"0x52f273a06a420453aa5b33c4f175395c9a1fddd8", "to":"0x541e8e0b0f25f799f941932ddcb93bb83d254e64", "value": 1e18}], "id":1}' -X POST http://localhost:8545/

  // Do some work
  // progress(50);

    var postData = {"jsonrpc":"2.0","method":"eth_sendTransaction","params": [{"from":"204b3339cba94ca7becb665e4a95aad293da98e0a521fa12d6e12c29788e934a", "to": '0xfaffb3ea092392a37eccd0625810a98f2b797ccf', "value": 1e18, "currency": " TNS"}], "id":1}
    var url = 'http://localhost:8545/'
    var options = {
      method: 'post',
      body: postData,
      json: true,
      url: url
    }
    request(options, function (err, res, body) {
      if (err) {
        console.error('error posting json: ', err)
        throw err
      }
      var headers = res.headers
      var statusCode = res.statusCode
      console.log('headers: ', headers)
      console.log('statusCode: ', statusCode)
      console.log('body: ', body)
    })

  // Finish the task asynchronously
  setTimeout(function() {
    resolve();
  }, 3000);
});




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
