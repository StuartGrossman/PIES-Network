$(document).ready(function() {
  var loadTime = Math.floor((Math.random() * 3000) + 500);
  setTimeout(function(){
    $('.loader').hide();
    $('.loaderSection').hide();
    $('.main-container').css("display", "initial")
  }, loadTime);

  $.toast({
      heading: 'Welcome back',
      text: 'PIES Network is loading',
      position: 'top-right',
      loaderBg: '#ff6849',
      icon: 'info',
      hideAfter: loadTime,
      stack: 6
  })
});
