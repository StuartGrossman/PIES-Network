var express = require('express');
var router = express.Router();
var request = require('request');
var Web3 = require('web3');
var web3 = new Web3();
var Eth = require('ethjs-query')
var EthContract = require('ethjs-contract')


web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
var coinbase = web3.eth.coinbase;
var balance = web3.eth.getBalance(coinbase, function(err, res){
  // console.log(balance)
});
console.log("test")

// web3.eth.register("0x407d73d8a49eeb85d32cf465507dd71d507100ca");
var account = web3.eth.accounts[0];
// var account = "0xf5a058b428c04d6ebec97aa774cf65c528da4344"
console.log(account);

// curl -d '{"jsonrpc":"2.0","method":"eth_sendTransaction","params": [{"from":"0x52f273a06a420453aa5b33c4f175395c9a1fddd8", "to":"0x541e8e0b0f25f799f941932ddcb93bb83d254e64", "value": 1e18}], "id":1}' -X POST http://localhost:8545/

// console.log("batch")
// var batch = web3.createBatch();
// batch.add(web3.eth.getBalance.request(account, 'latest', function(error, result){
//   console.log(error, result)
  // var balance = new BigNumber('131242344353464564564574574567456');
  // or var balance = web3.eth.getBalance(someAddress);

  // balance.plus(21).toString(10);
// }));
// batch.add(web3.eth.contract(abi).at(address).balance.request(address, callback2));
// batch.execute();

router.get('/', function(req, res){
  console.log("route being hit")
})

module.exports = router;
