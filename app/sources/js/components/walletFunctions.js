var wallet = (function(firebaseDataBase, userObject){
  'use strict';

  function sendCode(){
    var button = document.getElementById('sendCodeButton')
    button.setAttribute('disabled', 'true');
    firebase.database().ref('/queue/withdrawPhoneCheck/tasks').push({'userId': userObject.uid, "message": "PIES Withdraw code is"}).then(function(res, err){
      console.log(res, err);
      setTimeout(function(){
        button.removeAttribute('disabled')
      }, 1500)
    });
  }

  function confirmWithdrawl(){
    var code = document.getElementById('confirmationCode').value;
    // get internalBalance before change
    firebase.database().ref('/phone/' + userObject.uid).once('value', function(snapshot){
      if(snapshot.val()){
        if(snapshot.val().code == code){
          firebase.database().ref('/queue/withdrawlAmmount/tasks').push({'userId': userObject.uid, 'ammount': totalWithdrawlAmmount, 'fee':  tokenFeeAmmount, 'ethAddress': withdrawlEthAddress}).then(function(res){
            //check internalBalance vs withdrawl ammount
          })
        }
      }
    })

  }

  function confirmAmmount(ammount){
    firebase.database().ref('/internalBalance/' + userObject.uid).once('value', function(snapshot){
      var data = snapshot.val()
      if(data.balance){
        // + fee
        ammountConfirmed = Number(data.balance);
        return
      }
    })
  }

  function calculateFee(){
    //sets innerHTML of confirmation window
    document.getElementById('ethAddressForWithdrawl').innerHTML = withdrawlEthAddress;
    document.getElementById('ammountForWithdrawl').innerHTML = numberWithCommas(withdrawlAmmount);

    console.log(withdrawlEthAddress, withdrawlAmmount);
    firebase.database().ref('/fee').once('value', function(snapshot){
      var data = snapshot.val();
      var fee = data.ethPrice / 1000

      tokenFeeAmmount = Math.ceil(fee / data.tokenPrice);
      console.log(fee, tokenFeeAmmount);
      document.getElementById('fee').innerHTML = tokenFeeAmmount;
      totalWithdrawlAmmount = numberWithCommas(withdrawlAmmount - tokenFeeAmmount);
      document.getElementById('totalWithdrawlAmmount').innerHTML = totalWithdrawlAmmount;
    })
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

      firebase.database().ref('queue/myEthAddress/tasks').push({"ethAddress": ethAddress.value, "userId": userObject.uid}).then(function(err, res){
        console.log(res, err)
        setTimeout(function(){
          loaderHide();
          document.getElementById('editEth').style.display = "none";
          document.getElementById('edit').innerHTML = "edit";
          var myAddres = document.getElementById('myAddress');
          firebase.database().ref('user/' + userObject.uid ).once('value', function(snapshot){
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
});
