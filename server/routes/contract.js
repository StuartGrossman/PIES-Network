var express = require('express');
var router = express.Router();
var request = require('request');
var Web3 = require('web3');
// var Tx = require('ethereumjs-tx');
// var _ = require('lodash');
// var SolidityFunction = require('web3/lib/web3/function');
// var keythereum = require("keythereum");
// var web3 = new Web3();
// web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
//
//
//
// // Variables
//
//
//
// // This is what you get from keythereum when generating a new private key:
// // var dk = {
// //     "dk": {
// //         "privateKey": {
// //             "type": "Buffer",
// //             "data": [
// //                 251,
// //                 130,
// //                 130,
// //                 184,
// //                 46,
// //                 69,
// //                 62,
// //                 86,
// //                 16,
// //                 1,
// //                 166,
// //                 96,
// //                 184,
// //                 89,
// //                 54,
// //                 191,
// //                 54,
// //                 119,
// //                 213,
// //                 251,
// //                 162,
// //                 8,
// //                 241,
// //                 40,
// //                 200,
// //                 21,
// //                 82,
// //                 232,
// //                 200,
// //                 137,
// //                 251,
// //                 135
// //             ]
// //         },
// //         "iv": {
// //             "type": "Buffer",
// //             "data": [
// //                 214,
// //                 200,
// //                 194,
// //                 220,
// //                 251,
// //                 16,
// //                 12,
// //                 200,
// //                 144,
// //                 160,
// //                 41,
// //                 133,
// //                 200,
// //                 56,
// //                 39,
// //                 198
// //             ]
// //         },
// //         "salt": {
// //             "type": "Buffer",
// //             "data": [
// //                 2,
// //                 2,
// //                 82,
// //                 45,
// //                 73,
// //                 187,
// //                 119,
// //                 171,
// //                 227,
// //                 87,
// //                 73,
// //                 56,
// //                 48,
// //                 187,
// //                 180,
// //                 207,
// //                 156,
// //                 112,
// //                 187,
// //                 205,
// //                 194,
// //                 99,
// //                 48,
// //                 150,
// //                 249,
// //                 210,
// //                 117,
// //                 187,
// //                 193,
// //                 153,
// //                 4,
// //                 137
// //             ]
// //         }
// //     }
// // };
//
// // var privateKey = new Buffer(dk.dk.privateKey.data);
// // console.log('privateKey');
// // console.log(privateKey);
//
// // This is the actual solidity code that was used to create the token:
// //contract token {
// //    mapping (address => uint) public coinBalanceOf;
// //    event CoinTransfer(address sender, address receiver, uint amount);
// //
// //  /* Initializes contract with initial supply tokens to the creator of the contract */
// //  function token(uint supply) {
// //        if (supply == 0) supply = 10000;
// //        coinBalanceOf[msg.sender] = supply;
// //    }
// //
// //  /* Very simple trade function */
// //    function sendCoin(address receiver, uint amount) returns(bool sufficient) {
// //        if (coinBalanceOf[msg.sender] < amount) return false;
// //        coinBalanceOf[msg.sender] -= amount;
// //        coinBalanceOf[receiver] += amount;
// //        CoinTransfer(msg.sender, receiver, amount);
// //        return true;
// //    }
// //}
//
//
// // Step 1: This is the ABI from the token solidity code
// var ABI = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"type":"function"},{"inputs":[{"name":"_initialAmount","type":"uint256"},{"name":"_tokenName","type":"string"},{"name":"_decimalUnits","type":"uint8"},{"name":"_tokenSymbol","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]
//
//
// // Step 2:
// // var solidityFunction = new SolidityFunction('', _.find(ABI, { name: 'pies' }), '');
// // console.log('This shows what toPayload expects as an object');
// // console.log(solidityFunction)
// var walletContractAddress = '0xa27578ea3c9eb131163e16185adf210df0df0d8d';
// var toAccount = '0xc969238d0ec056847318e2e5164fa6c32984431b';
// var fromAccount = '0x4cd382fd21b204fa21759f4ae0044efe85a56134';
// var token = web3.eth.contract(ABI).at(walletContractAddress);
// // contract-instance.<method-name>.getData(arg1, arg2)
// // var payloadData = token.sendCoin.getData(0x00001, 10); //
// // console.log(token)
// token.transferFrom(fromAccount, toAccount, 1e18);
// //
// // // Step 3:
// // var payloadData = solidityFunction.toPayload([toAccount, 3]).data;
// //
// // // Step 4:
// gasPrice = web3.eth.gasPrice;
// gasPriceHex = web3.toHex(gasPrice);
// gasLimitHex = web3.toHex(300000);
// //
// console.log('Current gasPrice: ' + gasPrice + ' OR ' + gasPriceHex);
// //
// // nonce =  web3.eth.getTransactionCount(fromAccount) ;
// // nonceHex = web3.toHex(nonce);
// // console.log('nonce (transaction count on fromAccount): ' + nonce + '(' + nonceHex + ')');
// //
// // var rawTx = {
// //     nonce: nonceHex,
// //     gasPrice: gasPriceHex,
// //     gasLimit: gasLimitHex,
// //     to: walletContractAddress,
// //     from: fromAccount,
// //     value: '0x00',
// //     data: payloadData
// // };
// //
// // // Step 5:
// // var tx = new Tx(rawTx);
// // tx.sign(privateKey);
// //
// // var serializedTx = tx.serialize();
// //
// // web3.eth.sendRawTransaction(serializedTx.toString('hex'), function (err, hash) {
// //     if (err) {
// //         console.log('Error:');
// //         console.log(err);
// //     }
// //     else {
// //         console.log('Transaction receipt hash pending');
// //         console.log(hash);
// //     }
// // });
// //
// //
//
//
// router.get('/', function(req, res){
//   console.log("route being hit")
// })
//
module.exports = router;
