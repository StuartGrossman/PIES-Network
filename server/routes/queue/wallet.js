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

var queue = new Queue(ethRef, function(data, progress, resolve, reject) {
  console.log(data)
  db.ref('user/' + data.userId ).update({'ethAddress': data.ethAddress}).then(function(res, err){
    resolve();
  });
})

var queue = new Queue(balanceRef, function(data, progress, resolve, reject) {
  console.log(data.ethAddress)
  var balance = token.balanceOf(data.ethAddress)
  console.log(balance, "balance");
  // console.log(balance.plus(21).toString(10));
  // console.log(token, token.balanceOf(data.ethAddress))
  db.ref('balance/' + data.userId ).update({'balance': balance}).then(function(res, err){
    resolve();
  });

})


module.exports = router;
