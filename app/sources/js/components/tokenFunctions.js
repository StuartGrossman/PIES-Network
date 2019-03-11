var tokenFunctionList = (function(userObject, firebaseDataBase){
  'use strict';


  function editEthAddress(){
    if(document.getElementById('editEth').style.display == "none"){
      document.getElementById('edit').innerHTML = "close";

      document.getElementById('editEth').style.display = "block";
      // document.getElementById
    }else{
      document.getElementById('editEth').style.display = "none";
      document.getElementById('edit').innerHTML = "edit";

    }
  }

  function submitEthAddress(){
    console.log('submitting address')
    var ethAddress = document.getElementById('myEthAddress');
    // var testAccount = '0x541E8E0b0F25f799F941932dDcB93bB83d254E64'
    // testAccount = testAccount.split('');
    console.log(ethAddress.value.length)
    if(ethAddress.value.length > 41 && ethAddress.value.length < 43){
      // console.log(ethAddress.value)
      // document.getElementById('main-container').style.display = 'none';
      loaderShow();
      // document.getElementById('loaderSection').style.display = "inital";
      // document.getElementById('loader').style.display = "inital";

      firebaseDataBase.ref('queue/myEthAddress/tasks').push({"ethAddress": ethAddress.value, "userId": userObject.uid}).then(function(err, res){
        console.log(res, err)
        setTimeout(function(){
          loaderHide();
          document.getElementById('editEth').style.display = "none";
          document.getElementById('edit').innerHTML = "edit";
          var myAddres = document.getElementById('myAddress');
          firebaseDataBase.ref('user/' + userObject.uid ).once('value', function(snapshot){
            var data = snapshot.val();
            if(data){
              if(data.ethAddress){
                myAddres.innerHTML = data.ethAddress;
              }else{
                return;
              }
            }else{
              return;
            }
          })
        }, 1000)
        loadBalance();
      });
    }
  }

  this.loadBalance = function loadBalance(){
    var userBalanceRef = firebaseDataBase.ref('balance/' + userObject.uid);
    var userRef = firebaseDataBase.ref('user/' + userObject.uid);

    userBalanceRef.on('value', function(snapshot){
      var data = snapshot.val();
      if(data.balance){
        var balance = numberWithCommas(data.balance);
        document.getElementById('balance').innerHTML = balance + ' <i style="color:white"><b>PIES</b></i>';


        // if(data.myBalance){

          // document.getElementById('p-completion-number').innerHTML = balance;
          //
          // document.getElementById('myAddress').innerHTML = data.ethAddress;
          // document.getElementById('ethHolder').className = 'animated fadeIn';

        // }
      }
      else{
        userRef.on('value', function(snapshot){
          if(snapshot.val().ethAddress){
            firebaseDataBase.ref('queue/myEthBalance/tasks').push({"ethAddress": snapshot.val().ethAddress, "userId": userObject.uid});
          }
          else{
            document.getElementById('balance').innerHTML = 'Please Login to Meta Mask!'
          }
        })
      }
    })

  }
  this.loadInternalBalance = function loadinternalBalance(){
    var userInternalBalanceRef = firebaseDataBase.ref('internalBalance/' + userObject.uid);
    userInternalBalanceRef.on('value', function(snapshot){
      var internalBalance = snapshot.val();
      if(internalBalance){
        // console.log(internalBalance);
        var internalBalanceNumber = numberWithCommas(internalBalance.balance);
        document.getElementById('internalBalance').innerHTML = internalBalanceNumber  + ' <i style="color:white"><b>PIES</b></i>';
      }
    })
  }
  function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

});
