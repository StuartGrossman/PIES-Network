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
var Eth = require('ethjs-query');
var EthContract = require('ethjs-contract');
var HumanStandardToken = require('../contract/contract.json');

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


var token = web3.eth.contract(HumanStandardToken).at('0xCf94cE2B6623dE5bD48849A3A3e813643c59b7C1');

var ethRef = admin.database().ref('/queue/myEthAddress/');
var balanceRef = admin.database().ref('/queue/myEthBalance/');
var withdrawlRef = admin.database().ref('/queue/withdrawlAmmount/');

var queue = new Queue(ethRef, function(data, progress, resolve, reject) {
  // console.log(data)
  db.ref('user/' + data.userId ).update({'ethAddress': data.ethAddress}).then(function(res, err){
    resolve();
  });
})

var queue = new Queue(withdrawlRef, function(data, progress, resolve, reject) {
  console.log(data)
  var interbalanceRef = db.ref('/internalBalance/' + data.userId);
  interbalanceRef.once('value', function(snapshot){

    if(snapshot.val()){
      console.log(snapshot.val(), data)
      if(snapshot.val().balance >= data.ammount + data.fee){

        //bank account
        var mainAccount = '0x20c38C5F0aC3B78f89f16B3D35E582D1EBda894B';
        //gets calldata for eth network
        var callData = token.transfer.getData(data.ethAddress, data.ammount);
        var postData = {"jsonrpc":"2.0","method":"eth_sendTransaction","params": [{"from": mainAccount, "to": '0xCf94cE2B6623dE5bD48849A3A3e813643c59b7C1', "data": callData}], "id":1}
        var url = 'http://localhost:8545/'
        var options = {
          method: 'post',
          body: postData,
          json: true,
          url: url
        }
        request(options, function (err, res, body) {
          if (err) {
            console.error('error posting json: ', err);
            throw err
            reject();
          }
          // var headers = res.headers
          // var statusCode = res.statusCode
          console.log('headers: ', headers)
          console.log('statusCode: ', statusCode)
          console.log('body: ', body)
          console.log(token.balanceOf(mainAccount) + " tokens balance")
          // admin.database().ref('internalBalance/' + )
          reslove();
        })
      }
    }
  });
})

var queue = new Queue(balanceRef, function(data, progress, resolve, reject) {
  console.log(data.ethAddress)
  if(!data.ethAddress){
    resolve();
  }
  var balance = token.balanceOf(data.ethAddress)
  console.log(balance, "balance");
  // console.log(balance.plus(21).toString(10));
  // console.log(token, token.balanceOf(data.ethAddress))
  if(!balance || balance < 1){
    reslove();
  }
  db.ref('balance/' + data.userId ).update({'balance': balance}).then(function(res, err){
    resolve();
  });

})

function withdrawFunds(ammount, withdrawlAddress){
  console.log('hitting withdrawl')
  var mainAccount = '0x20c38C5F0aC3B78f89f16B3D35E582D1EBda894B';

  var callData = token.transfer.getData(withdrawlAddress, ammount);

  var postData = {"jsonrpc":"2.0","method":"eth_sendTransaction","params": [{"from": mainAccount, "to": '0xCf94cE2B6623dE5bD48849A3A3e813643c59b7C1', "data": callData}], "id":1}
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
    // var headers = res.headers
    // var statusCode = res.statusCode
    console.log('headers: ', headers)
    console.log('statusCode: ', statusCode)
    console.log('body: ', body)
    console.log(token.balanceOf(mainAccount) + " tokens balance")
    // admin.database().ref('internalBalance/' + )
    return true;
  })

}

module.exports = router;
