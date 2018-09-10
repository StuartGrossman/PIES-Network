var flowFunctions = (functions(){
  'use strict'
  this.changeViewer = function changeViewer(){
    document.getElementById('viewer').style.display = '';
    document.getElementById('publisher').style.display = 'none';
    document.getElementById('title').innerHTML= 'Viewer Flow';

  }
  this.changePublisher = function changePublisher(){
    document.getElementById('publisher').style.display = '';
    document.getElementById('viewer').style.display = 'none';
    document.getElementById('title').innerHTML= 'Publisher Flow';

  }
  window.onload = function(){
    document.getElementById('viewer').style.display = 'none';
  }
})
