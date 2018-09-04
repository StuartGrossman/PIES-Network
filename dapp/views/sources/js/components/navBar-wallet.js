var navBarWallet = (function(firebaseDataBase, userObject){
  'use strict';

  this.changeClaimButtonText = function changeClaimButtonText(button){
    button.innerHTML = '100 PIES Tokens'
  }

  this.unChangeClaimButtonText = function unChangeClaimButtonText(button){
    button.innerHTML = 'Free Tokens'
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

  var metaMaskText;
  this.changeMetaMaskBalanceText = function changeMetaMaskBalanceText(button){
    if(button.innerHTML === 'Deposite'){
      return
    }else{
      metaMaskText = button.innerHTML;
      button.innerHTML = 'Deposite';
    }
  }
  this.unChangeMMBalanceText = function unChangeMMBalanceText(button){
    button.innerHTML = metaMaskText;
  }
})
