var typeWriterFunctions = (function(){
  'use strict'
  var i = 0;
  var txt = ['Low fees. Fair exchange. Curated information.'
  , 'Target your audience customize your feedback.'
  , "Get paid for you're precious time & make an impact with great feedback"]; /* The text */
  // , 'Target your Aduience, get real feedback.', 'Create better relationships between your content and its community.'
  var speed = 100; /* The speed/duration of the effect in milliseconds */

  var app = document.getElementById('typeWriterTitle');
  function swapTitleText(){
    setTimeout(function(){

      app.classList.add('animated', 'fadeOut')
      setTimeout(function(){
        app.innerHTML = txt[1]

        app.classList.remove('fadeOut')
        app.classList.add('fadeIn')

        setTimeout(function(){
          app.classList.add('animated', 'fadeOut')

          setTimeout(function(){
            app.classList.remove('fadeOut')
            app.innerHTML = txt[2]

            app.classList.add('fadeIn')
            setTimeout(function(){
              app.classList.remove('fadeIn')
              app.classList.add('fadeOut')

              setTimeout(function(){
                app.classList.remove('fadeOut')

                app.innerHTML = txt[0]

                app.classList.add('fadeIn')
                swapTitleText();

              }, 2000)

            }, 6000)

          }, 2000)

        }, 6000)

      }, 2000)

    }, 6000)
  }
  swapTitleText();

})
