var navBarWallet = (function(userObject, firebaseDataBase){
  'use strict';

  this.changeClaimButtonText = function changeClaimButtonText(button){
    button.innerHTML = 'Claim Now!'
  }

  this.unChangeClaimButtonText = function unChangeClaimButtonText(button){
    button.innerHTML = 'Free Tokens!'
  }

  var internalBalanceText;
  this.changeInternalBalanceText = function changeInternalBalanceText(button){
    if(button.innerHTML === 'Withdraw'){
      return
    }else{
      internalBalanceText = button.innerHTML;
      button.innerHTML = 'Withdraw'
    }
  }

  this.unChangeInternalBalanceText = function unChangeInternalBalanceText(button){
    button.innerHTML = internalBalanceText;
  }

  // var metaMaskText;
  // this.changeMetaMaskBalanceText = function changeMetaMaskBalanceText(button){
  //   if(button.innerHTML === 'Deposite'){
  //     return
  //   }else{
  //     metaMaskText = button.innerHTML;
  //     button.innerHTML = 'Deposite';
  //   }
  // }
  // this.unChangeMMBalanceText = function unChangeMMBalanceText(button){
  //   button.innerHTML = metaMaskText;
  // }
  this.freeTokens = function freeTokens(){
    console.log(firebaseDataBase)
    var queue = firebaseDataBase.ref('/queue/freeTokens/tasks');

    queue.push({'userId': userObject.uid}).then(function(){
      //checks status of percentage in server
        return;
    })
  }
})
