$(document).ready(function() {
  // console.log("js script online")
  var loadTime = Math.floor((Math.random() * 3000) + 500);
  //////loader
  // $('.main-container').css("display", "none");
  // $('#successMessage').hide();
  setTimeout(function(){
    $('.loader').hide();
    $('.loaderSection').hide();



    $('.main-container').css("display", "initial")
  }, loadTime);
    $.toast({
        heading: 'Welcome back!',
        text: 'PIES Network is loading',
        position: 'top-right',
        loaderBg: '#ff6849',
        icon: 'info',
        hideAfter: loadTime,
        stack: 6
    })
  });

  var loaderShow = function(){
    $('.main-container').css("display", "none")

    $('.loader').show();
    $('.loaderSection').show();

  }
  var loaderHide = function(){
    $('.loader').hide();
    $('.loaderSection').hide();
    $('.main-container').show();

}
