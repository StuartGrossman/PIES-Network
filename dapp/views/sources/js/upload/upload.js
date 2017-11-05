var uid = uuid();
var previewUrl;
var user;
var duration;
var userObject;
var HumanStandardToken = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "PIES" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "1000000000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "18" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_value", "type": "uint256" } ], "name": "burn", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "standard", "outputs": [ { "name": "", "type": "string", "value": "Token 0.1" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "", "type": "uint256", "value": "11015" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "burnFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "PIES" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" }, { "name": "", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "initialSupply", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "initial Supply", "template": "elements_input_uint", "value": "1000000000" }, { "name": "tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "token Name", "template": "elements_input_string", "value": "PIES" }, { "name": "decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "decimal Units", "template": "elements_input_uint", "value": "18" }, { "name": "tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "token Symbol", "template": "elements_input_string", "value": "PIES" } ], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "from", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" } ], "name": "Burn", "type": "event" } ]
// var abi = JSON.parse(HumanStandardToken)
// console.log(HumanStandardToken)
var config = {
  apiKey: "AIzaSyBNyW7vjQSK2Gbrh4Mzox6G-uAG4gK1rgE",
  authDomain: "adspace-9fe5c.firebaseapp.com",
  databaseURL: "https://adspace-9fe5c.firebaseio.com",
  projectId: "adspace-9fe5c",
  storageBucket: "adspace-9fe5c.appspot.com",
  messagingSenderId: "129227170241"
};

firebase.initializeApp(config);

var ref = firebase.database().ref('queue/tasks');
var user;

firebase.auth().onAuthStateChanged(function(userObj) {
  if(userObj){
    // console.log(userObj)
    userObject = userObj;
    // writeUserData(u)
    user = userObj
    document.getElementById('userImage').src = user.photoURL;
    document.getElementById('userName').innerHTML = user.displayName;
    loadBalance();
    getDefaultTags(user);

    checkState(user);


  }
})

function checkState(user){
  firebase.database().ref('usertype/' + user.uid).on('value', function(snapshot){
    // console.log(snapshot.val())
    var userStatus = snapshot.val().type;
    if(userStatus){
      // console.log(userStatus)
      if(userStatus == '99'){
        return;
      }else if(userStatus == '10'){
        window.location = '/v-settings';
      }
    }else{
      window.location = '/';
    }
  })
}
var DefaultTagData;
function getDefaultTags(user){

  var tagsRef = firebase.database().ref('/tag/' + user.uid + '/default/');
  tagsRef.on('value', function(snapshot){
    // console.log(snapshot.val())
    var data = [];
    for(var i  in snapshot.val()){

      data.push(snapshot.val()[i])
    }

    DefaultTagData = data;


  })

}

function uuid() {
   return "" + s4() + s4() + "-" + s4() + "-" + s4() + s4() + "-" + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function loadBalance(){
  if(userObject){
    var userRef = firebase.database().ref('user/' + userObject.uid);
    var data;
    userRef.on('value', function(snapshot){
      data = snapshot.val();
      // console.log(data);
      if(data.ethAddress){
        firebase.database().ref('queue/myEthBalance/tasks').push({"ethAddress": data.ethAddress, "userId": userObject.uid});
        if(data.myBalance){
          var balance = numberWithCommas(data.myBalance);
          document.getElementById('balance').innerHTML = 'Balance: ' + balance + ' <i><b>PIES</b></i>';
          document.getElementById('p-completion-number').innerHTML = balance;

        }
      }
    })
  }


}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


// function submit(){
//   queueRef = firebase.database().ref('queue/ipfs/tasks/');
//   console.log("hitting queue", duration)
//   queueRef.push(
//       {
//         "userId": user.uid,
//         "previewId": uid,
//         "duration": duration,
//         "downloadURL": previewUrl
//       }
//   ).then(function(){
//     // window.location.href = '/a-ads';
//     console.log("success")
//   })
//
//
// }
//
function uploadVideo(){
  var storageRef = firebase.storage().ref();
  var dbPathRecord = "/user/" + user.uid + "/preview/";
  var file = document.getElementById('input-file-max-fs').files[0];
  // var duration = file.duration;

  var uploadTask = storageRef.child(dbPathRecord).put(file).then(function(snapshot) {

  console.log('Uploaded a blob or file!', snapshot);

  savePreview(snapshot, dbPathRecord);
  })
}

// function submitAd(){
//   var ad = document.getElementById("uploadAdWindow");
//
//   ad.style.display = "none"
//
//   var video = document.getElementById('video1');
//   var source = document.createElement('source');
//
//   source.setAttribute('src', previewUrl);
//
//   video.appendChild(source);
//   // video.load();
//   // var dur = video.duration;
//   //
//   // // video.play();
//   // console.log(dur)
//   play();
//
// }
// function play(){
//
//   var vid = document.getElementById("video1");
//   var div = document.getElementById('uploadAdPreview');
//   var sub = document.getElementById('submit');
//   div.style.display = "block";
//   setTimeout(function() {
//     // console.log("looping")
//     // video.load();
//     // video.play();
//     // loop();
//     duration = vid.duration
//     sub.style.display = "flex"
//
//   }, 2000);
// }
function savePreview(snapshot, dbPathRecord){
 previewUrl = snapshot.metadata.downloadURLs[0];

  var type = snapshot.metadata.contentType;
  var bytes = snapshot.metadata.size;

  console.log(previewUrl, bytes, type)
  if(snapshot.state === "success"){
    firebase.database().ref(dbPathRecord).set({
            'ts': firebase.database.ServerValue.TIMESTAMP,
            'uploadUrl': previewUrl,
            'name': snapshot.metadata.name,
            'clientDate': Date.now(),
            'type': type
            }).then(function(){
              setVideoElement(previewUrl)

            }, function(error) {
              console.log(error);
              return false;
            })
  }

}

function setVideoElement(previewUrl){

    var video = document.getElementById('previewVideoCage');
    var source = document.createElement('source');

    source.setAttribute('src', previewUrl);

    video.appendChild(source);
    return;
}
function step1(){

}
function step4(){

}

var checkbox10 = 0;
var checkbox11 = 0;
var checkbox12 = 0;
var checkbox13 = 0;

function checkBox10(){
  console.log(
    'inside checkbox 10 function'
  )
  if(checkbox10 === 0){
    checkbox10 = 1;
    document.getElementById('input11').style.display = 'none'
    document.getElementById('input12').style.display = 'none'

  }else{
    checkbox10 = 0;
    document.getElementById('input11').style.display = 'flex'
    document.getElementById('input12').style.display = 'flex'

  }
}




function checkBox11(){
  if(checkbox11 === 0){
    checkbox11 = 1;

  }else{
    checkbox11 = 0;

  }
}
function checkBox12(){
  if(checkbox12 === 0){
    checkbox12 = 1;
  }else{
    checkbox12 = 0;
  }
}
function checkBox13(){
  if(checkbox12 === 0){
    checkbox12 = 1;
    // document.getElementById('checkbox-11').removeAttribute("checked");
    // document.getElementById('checkbox-12').removeAttribute("checked");

    document.getElementById('customFeedBack').style.display = 'block';

  }else{
    checkbox12 = 0;
    document.getElementById('customFeedBack').style.display = 'none';

  }
}
window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {

    // Use the browser's ethereum provider
    var provider = web3.currentProvider

    web3.eth.defaultAccount = web3.eth.accounts[0]
    // console.log(web3.eth.accounts[0])
    // console.log(provider)
  } else {
    console.log('No web3? You should consider trying MetaMask!')
  }
  //  startApp()
  setTimeout(function(){
      const eth = new Eth(web3.currentProvider)
      const contract = new EthContract(eth)
      // initContract(contract, eth)

  }, 2000)
  //  testTransaction()
})
function initContract(contract, eth){
  var contractAddress = '0xCf94cE2B6623dE5bD48849A3A3e813643c59b7C1'
  // var token = web3.eth.contract(HumanStandardToken).at(contractAddress);
  var token = contract(HumanStandardToken).at(contractAddress)

  // console.log(token)
  var address = '0x541E8E0b0F25f799F941932dDcB93bB83d254E64'
  var address2 = '0x20c38C5F0aC3B78f89f16B3D35E582D1EBda894B'
  // var callData = token.transferFrom.getData(address, address2, 100);

  // token.transferFrom(address, address2, 1000)
  // token.totalSupply(function(res, err){
  //   console.log(err, res)
  // })
  // token.balanceOf(address2, function(err,res){
  //   console.log(err,res)
  // })
  // token.transferFrom(address, address2, 100, function(err, res){
  //   console.log(err, res)
  // })
  // console.log(callData, contractAddress)
  // web3.eth.call({params: [{from: address, to: contractAddress, data: callData}]}, function(res,err){
  //   console.log(res, err)
  // })
  // web3.eth.sendTransaction({data: callData}, function(err, res){
  //   console.log(res, err)
  // })
  token.transfer(address2, 100, {from: address}).then(function (txHash) {
      console.log('Transaction sent', txHash)
      console.dir(txHash)
      waitForTxToBeMined(txHash, eth)
    })
    .catch(console.error)

}
async function waitForTxToBeMined (txHash, eth) {

  while (!txReceipt) {
    try {
      txReceipt = await eth.getTransactionReceipt(txHash)
      saveTxReceipt(txReceipt)
      console.log(txReceipt)
    } catch (err) {
      console.log(err)
      // return indicateFailure(err)
    }
  }
  publishSuccess()
  loadReceipt()
  // alert('success')
}

function saveTxReceipt(txHash){

}
function loadReceipt(){

}

var adObject = {
  cotentName: '',
  website: '',
  descrition: '',
  income: 'all',
  education: 'all',
  sexuality: 'all',
  webSpending: 'all',
  race: 'all',
  tags: [],
  age: 99,
};

function addContent(){
  adObject.contentName = document.getElementById('contentName').value;
  adObject.website = document.getElementById('website').value;
  adObject.descritpion = document.getElementById('description').value;
  adObject.income = document.getElementById('income').options[document.getElementById('income').selectedIndex].dataset.number;
  adObject.gender = document.getElementById('gender').options[document.getElementById('gender').selectedIndex].dataset.gender;
  adObject.race = document.getElementById('race').options[document.getElementById('race').selectedIndex].dataset.race;
  adObject.education = document.getElementById('education').options[document.getElementById('education').selectedIndex].dataset.education;
  console.log(adObject)
}

function addTags(){
  var input = document.getElementById('tags')

  var data = input.value;
  data = data.split(',');
  for(var i = 0; i < data.length ; i++){
    data[i] = data[i].toLowerCase();

  }
  adObject.tags = data;
  console.log(adObject)
  return;
}
