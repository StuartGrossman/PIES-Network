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

var token = web3.eth.contract(HumanStandardToken).at('0xCf94cE2B6623dE5bD48849A3A3e813643c59b7C1');
var testAccount = '0x541E8E0b0F25f799F941932dDcB93bB83d254E64'


function sendToken(address, ammount){
  var mainAccount = '0x20c38C5F0aC3B78f89f16B3D35E582D1EBda894B';

  var callData = token.transfer.getData(address, ammount);

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
        var headers = res.headers
        var statusCode = res.statusCode
        console.log('headers: ', headers)
        console.log('statusCode: ', statusCode)
        console.log('body: ', body)
        console.log(token.balanceOf(mainAccount) + " tokens balance")
        return;
      })
}


var ethRef = admin.database().ref('/queue/myEthAddress/');

var queue = new Queue(ethRef, function(data, progress, resolve, reject) {
  console.log(data)
})
module.exports = router;
