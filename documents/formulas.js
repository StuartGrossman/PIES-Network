function e(d,p){
  var t = d/100;

  var down = d * t;

  var up = p * (Math.pow(t, t));

  g = down - up;

  console.log(g)
  return g
}

console.log(e(200, 1));
