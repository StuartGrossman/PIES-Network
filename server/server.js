var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var port = process.env.PORT || 3000;
var admin = require('firebase-admin')
var serviceAccount = require("./serviceAccountKey.json");
var uuid = require('uid');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://adspace-9fe5c.firebaseio.com"
});
var defaultAuth = admin.auth();
var defaultDatabase = admin.database();
if(defaultDatabase){
  console.log(
    'Firebase Database Admin Connected!'
  )
}


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

/// resources

var linkUsers = require('./routes/tasks/linkUsers');
var ipfs = require('./routes/ipfs/ipfs');
var phone = require('./routes/queue/phone');
var contract = require('./routes/contract/contract');
var upload = require('./routes/queue/upload');
var queues = require('./routes/queue/queues');
var tags = require('./routes/queue/tags');
var wallet = require('./routes/queue/wallet');
var categories = require('./routes/queue/categories');

app.use('/categories', categories);
app.use('/wallet', wallet);
app.use('/linkUsers', linkUsers);
app.use('/ipfs', ipfs);
app.use('/deployContract', contract);
app.use('/phone', phone);
app.use('/upload', upload);
app.use('/queues', queues);
app.use('/tags', tags);





var server = app.listen(port, function() {
	var host = server.address().address;
	console.log('Server is listening at http://localhost:' + port);
});
