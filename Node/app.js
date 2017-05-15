// required modules
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ejs = require('ejs-locals');
// connect to MongoDB
//ar db = 'nodebook';
mongoose.connect('mongodb://localhost/nodebook');

// initialize our app
var app = express();

// app configuation
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));

app.set('view engine', 'html');
app.engine('.html', ejs);



app.use(logger('dev'));	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));


// create user model 
var User = mongoose.model('User', {
	username: String,
	password: String,
	image: String,
	bio: String,
	cluster:String
});

var Cluster = mongoose.model('Cluster', {
	clustername:String,
	users:Array
});

// create post model
var Status = mongoose.model('Status', {
	body: String,
	time: Number,
	username: String,
	image: String,
	comments: Array,
	likes: Array
});
/************************/
/*** RUN the Service  ***/
/************************/
var port = 3000;
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);
console.log('Express server listening on port %s', port);



/**************************/
/***    Presentation    ***/
/**************************/
//Index
app.get('/', function (req, res) {

	// Already logged in
	if (req.session.user){
		Status.find({}).sort({time: -1}).exec(function (err, statuses){
			//res.render('homepage', {user: req.session.user, statuses: statuses});

			res.redirect(path.join('/users/'+req.session.user.username));
		});
	// Not logged in
	} else {
		res.redirect('login');
	}
});

app.get('/logout', function (req, res) {

	// Already logged in
	if (req.session.user) {
		console.log('You has logged out');
		delete req.session.user;
	}
	// Not logged in
	res.redirect('/');

});

app.get('/login', function (req, res) {

	var error1 = null;
	var error2 = null;

	// Error msg for Sign Up
	if (req.query.error1) {
		error1 = "Sorry please try again";
	}
	// Error msg for Log in
	if (req.query.error2) {
		error2 = "Sorry please try again";
	}
	var clusterData = { 
		clustername: "fire",
		users:[]
	};
	var newCluster = new Cluster(clusterData).save(function (err){


	});

	Cluster.find({}).exec(function (err, clusters){
		//res.render('homepage', {user: req.session.user, statuses: statuses});
		if(err){
			console.log(err);
		}
		
		console.log(clusters);
		res.render('login', {error1: error1, error2: error2, cluster:clusters});
	});


	// var cursor = Cluster.find({});
	// console.log("!!!");
	// console.log(cursor);
	//res.render('login', {error1: error1, error2: error2, cluster:cursor});
	// res.render('login', {error1: error1, error2: error2, cluster:[]});

});


// update other user's profile
app.get('/moderator', function (req, res) {

	res.render('moderator');
	// Already logged in
	// if (req.session.user) {
	
	// 	var username = req.session.user.username;
	// 	var query = {username: username};

	// 	var newBio = req.body.bio;
	// 	var newImage = req.body.image;

	// 	var change = {bio: newBio, image: newImage};

	// 	User.update(query, change, function (err, user) {

	// 		Status.update(query, {image: newImage}, {multi: true}, function(err, statuses){
				
	// 			console.log('Username has updated their profile');
	// 			req.session.user.bio = newBio;
	// 			req.session.user.image = newImage;
	// 		    res.redirect(path.join('/users/'+username));
	// 		});

	// 	});
	// 	res.render('moderator');
	// // Not logged in
	// } else {
	// 	res.redirect('/login');
	// }
});


// update other user's profile
app.get('/sysadmin', function (req, res) {

	res.render('sysadmin');
	// Already logged in
	// if (req.session.user) {
	
	// 	var username = req.session.user.username;
	// 	var query = {username: username};

	// 	var newBio = req.body.bio;
	// 	var newImage = req.body.image;

	// 	var change = {bio: newBio, image: newImage};

	// 	User.update(query, change, function (err, user) {

	// 		Status.update(query, {image: newImage}, {multi: true}, function(err, statuses){
				
	// 			console.log('Username has updated their profile');
	// 			req.session.user.bio = newBio;
	// 			req.session.user.image = newImage;
	// 		    res.redirect(path.join('/users/'+username));
	// 		});

	// 	});
	// 	res.render('moderator');
	// // Not logged in
	// } else {
	// 	res.redirect('/login');
	// }
});

// view other user's profile
app.get('/users/:username', function (req, res) {

	// Already logged in
	if (req.session.user) {

		var username = req.params.username.toLowerCase();
		var query = {username: username};
		var currentUser = req.session.user;

		User.findOne(query, function (err, user) {

			if (err || !user) {
				res.send('No user found by id %s',username);
			} else {


				//TODO decide if which type of user  and route to different page
				//type ==>  user -> profile
				//			moderator -> moderator
				//			sysadmin --> admin


				Status.find(query).sort({time: -1}).exec(function(err, statuses){
					res.render('profile', {
						user: user, 
						statuses: statuses, 
						currentUser: currentUser
					});	
				});
			}
		});
	// Not logged in
	} else {

		res.redirect('/login');
	}
});


/***************************/
/***   Form Submission   ***/
/***************************/
app.post('/login', function (req, res) {
	var username = req.body.username.toLowerCase();
	var password = req.body.password;


	var query = {username: username, password: password};

	User.findOne(query, function (err, user) {

		if (err || !user) {
			//Error 2 ==> Error msg for Log in
			res.redirect('/login?error2=1');
		} else {
			req.session.user = user;
			console.log('You have logged in');
			res.redirect('/');
		}

	});
});


app.post('/signup', function (req, res){

	var username = req.body.username.toLowerCase();
	var password = req.body.password;
	var confirm = req.body.confirm;
	if(password != confirm) {
		res.redirect('/login?error1=1');
	}
	else {	
		var query = {username: username};
		User.findOne(query, function (err, user) {
			if(err){
				console.log(err);
			}

			if (user) {
				//Error 1 ==> Error msg for Sign Up
				res.redirect('/login?error1=1');
			} else {
				var userData = { 
					username: username,
					password: password,
					image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
					bio: 'Im new to NodeBook!',
					hidden: false,
					type: 'User',
					wall: []
				};
				var newUser = new User(userData).save(function (err){

					req.session.user = userData;
					console.log('New user has been created!');
					res.redirect(path.join('/users/'+username));

				});
			}
		});
	}
});



// update other user's profile
app.post('/profile', function (req, res) {

	// Already logged in
	if (req.session.user) {
	
		var username = req.session.user.username;
		var query = {username: username};

		var newBio = req.body.bio;
		var newImage = req.body.image;

		var change = {bio: newBio, image: newImage};

		User.update(query, change, function (err, user) {

			Status.update(query, {image: newImage}, {multi: true}, function(err, statuses){
				
				console.log('Username has updated their profile');
				req.session.user.bio = newBio;
				req.session.user.image = newImage;
			    res.redirect(path.join('/users/'+username));
			});

		});
	// Not logged in
	} else {
		res.redirect('/login');
	}
});

// post new posts
app.post('/statuses', function (req, res) {

	// Already logged in
	if (req.session.user) {
			var status = req.body.status;
			var username = req.session.user.username;
			var pic = req.session.user.image;
			var statusData = { 
				body: status,
				time: new Date().getTime(),
				username: username,
				image: pic,
				comments: [],
				likes: []
			};
			var newStatus = new Status(statusData).save(function (err) {
				console.log('User has posted a new status');
				io.sockets.emit('newStatus', {statusData: statusData});
				res.redirect(path.join('/users/'+username));
			});
	// Not logged in
	} else {
		res.redirect('/login');
	}
});
