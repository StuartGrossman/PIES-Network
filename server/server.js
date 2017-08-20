var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var admin = require('firebase-admin')
var serviceAccount = require("./serviceAccountKey.json");
var uuid = require('uuid');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adspace-9fe5c.firebaseio.com"
});
var defaultAuth = admin.auth();
var defaultDatabase = admin.database();



app.set('views', path.join(__dirname, 'views'));
//set the view engine that will render HTML from the server to the client
app.engine('.html', require('ejs').renderFile);
//Allow for these directories to be usable on the client side
// app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/bower_components'));
// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));


//we want to render html files
app.set('view engine', 'html');
app.set('view options', {
	layout: false
});

//middleware that allows for us to parse JSON and UTF-8 from the body of an HTTP request
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//on homepage load, render the index page
app.get('/', function(req, res) {
	res.render('index');
});

//
app.get('/', function(req, res){
	res.render('index')
})

// app.get('/about', function(req, res){
// 	res.render('about')
// })
// app.get('/verdicts', function(req, res){
// 	res.render('verdicts')
// })
// queues
var chargeRoutes = require('./routes/contract');
var queues = require('./routes/queues/linkUsers');
var ipfs = require('./routes/ipfs');
var phoneCheck = require('./routes/queues/phoneCheck');
var deployContract = require('./routes/queues/deployContract')
app.use('/contract', chargeRoutes);
app.use('/queues', queues);
app.use('/ipfs', ipfs);
app.use('/deployContract', deployContract);
app.use('/phoneCheck', phoneCheck)

// var billRoutes = require('./routes/bills');
//
// app.use('/bills', billRoutes);
//
// var userQueues = require('./queues/users');
//
// app.use('/queues', userQueues)


var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Example app listening at http://localhost:' + port);
});
