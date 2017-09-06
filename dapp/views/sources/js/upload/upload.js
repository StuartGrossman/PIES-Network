var uid = uuid();
var previewUrl;
var user;
var duration;
var userObject;
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
    console.log(userObj)
    userObject = userObj;
    // writeUserData(u)
    user = userObj
    document.getElementById('userImage').src = user.photoURL;
    document.getElementById('userName').innerHTML = user.displayName;
    loadBalance();

    checkState(user);


  }
})




function checkState(user){
  firebase.database().ref('user/' + user.uid).on('value', function(snapshot){
    console.log(snapshot.val())
    var userStatus = snapshot.val().userType;
    if(userStatus){
      console.log(userStatus)
      if(userStatus == 99){
        return;
      }else if(userStatus == 10){
        window.location = '/';
      }else{
        window.location = '/';
      }
    }else{
      window.location = '/';
    }
  })
}


function uuid() {
   return "" + s4() + s4() + "-" + s4() + "-" + s4() + s4() + "-" + s4() + s4();
}

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
}

function loadBalance(){
  var userRef = firebase.database().ref('user/' + userObject.uid);
  var data;
  userRef.on('value', function(snapshot){
    data = snapshot.val();
    console.log(data);
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
// function uploadVideo(){
//   var storageRef = firebase.storage().ref();
//   var sbPathRecord = "/user/" + user.uid + "/preview/" + uid;
//   var dbPathRecord = "/user/" + user.uid + "/preview/" + uid;
//   var file = document.getElementById('video').files[0];
//   var duration = file.duration;
//
//   var uploadTask = storageRef.child(sbPathRecord).put(file).then(function(snapshot) {
//
//   // console.log('Uploaded a blob or file!', snapshot);
//
//   savePreview(snapshot, dbPathRecord);
//   })
// }
//
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
// function savePreview(snapshot, dbPathRecord){
//   previewUrl = snapshot.metadata.downloadURLs[0];
//   // console.log(snap)
//   if(snapshot.state === "success"){
//     firebase.database().ref(dbPathRecord).set({
//             ts: firebase.database.ServerValue.TIMESTAMP,
//             uploadUrl: previewUrl,
//             name: snapshot.metadata.name,
//             storageUrl: snapshot.metadata.fullPath,
//             clientDate: Date.now(),
//             key: uid,
//             type: 'image'
//             }).then(function(){
//               // var button = document.getElementById("button").style.display = "flex";
//
//             }, function(error) {
//               console.log(error);
//               return false;
//             })
//   }
//
// }
function step1(){

}
function step4(){
  var input = document.getElementById('tags')

  var data = input.value;
  data = data.split(',');
  for(var i = 0; i < data.length ; i++){
    data[i] = data[i].toLowerCase();

  }
  console.log(data);
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
  }else{
    checkbox12 = 0;
  }
}
