var typeWriterFunctions = (function(){
  'use strict'
  var i = 0;
  var txt = ['Low fees. Fair exchange. Curated information.' , 'Target your Aduience, get real feedback.', 'Create better relationships between your content and its community.']; /* The text */
  // , 'Target your Aduience, get real feedback.', 'Create better relationships between your content and its community.'
  var speed = 100; /* The speed/duration of the effect in milliseconds */

  var app = document.getElementById('typeWriterTitle');


// setTimeout(function(){
var typewriter = new Typewriter(app, {
    loop: true
});

// }, 3000)
app.innerHTML = 'Low fees. Fair exchange. Curated information.';
app.fadeOut()
typewriter.pauseFor(3000)
    .deleteAll()
    .typeString('Create relationships between content & community.')
    .pauseFor()
    .deleteAll()
    .typeString('Target an audience, get real feedback.')
    .pauseFor()
    .deleteAll()
    // .typeString('Create relationships between content & community.')
    // .pauseFor()
    .start();
})
