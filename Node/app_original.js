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
	cluster:String,
	type:String
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
	likes: Array,
	cluster:String
});


var Message = mongoose.model('Message', {
	body: String,
	time: Number,
	from: String,
	to: String,
	image: String
});
/************************/
/*** RUN the Service  ***/
/************************/
var port = 3000;
var server = http.createServer(app);
var io = require('socket.io').listen(server);
server.listen(port);
console.log('Express server listening on port %s', port);



app.get('/test', function (req, res) {
	res.render('profile');
});

/**************************/
/***    Presentation    ***/
/**************************/
//Index
app.get('/', function (req, res) {

	// Already logged in
	if (req.session.user){


		res.redirect(path.join('/users/'+req.session.user.username));
		// Status.find({}).sort({time: -1}).exec(function (err, statuses){
		// 	//res.render('homepage', {user: req.session.user, statuses: statuses});
		// });
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

	User.findOne({username:'sysadmin'}, function (err, user) {
		if(err || !user){
			var userData = { 
					cluster: 'ALL',
					username: 'sysadmin',
					password: 'admin',
					image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
					bio: 'Hello, this is my bio!',
					hidden: false,
					type: 'Sysadmin'
			};
			var newUser = new User(userData).save(function (err){});
		}
	});


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
	// var clusterData = { 
	// 	clustername: "fire",
	// 	users:[]
	// };
	// var newCluster = new Cluster(clusterData).save(function (err){});

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




// view other user's profile
app.get('/users/:username', function (req, res) {

	// Already logged in
	if (req.session.user) {

		var username = req.params.username.toLowerCase();
		var query = {username: username};
		var currentUser = req.session.user;

		User.findOne(query, function (err, user) {

			if (err || !user) {
				res.send('No user found by id');
			} else {


				//TODO decide if which type of user  and route to different page
				//type ==>  user -> profile
				//			moderator -> moderator
				//			sysadmin --> admin

				var clustername;
				Cluster.find({}).exec(function (err, clusters){
					//res.render('homepage', {user: req.session.user, statuses: statuses});
					if(err){
						console.log(err);
					}
					clustername = clusters;
				
					console.log("!!!!!");
					console.log(req.session.user);

					if(user.type === 'User'){
						//current user only
						//Status.find(query).sort({time: -1}).exec(function(err, statuses){
						//all user
						console.log("@@@@@");
						console.log(clustername);
						var query = { $or:[{cluster: user.cluster},{cluster: 'ALL'}]};
						Status.find(query).sort({time: -1}).exec(function(err, statuses){
							
							User.find({}).sort({time: -1}).exec(function(err, allusers){
								
								Message.find({to: user.username}).sort({time: -1}).exec(function(err, messages){
								
									res.render('profile',{
										messages: messages,
										allusers: allusers,
										user: user, 
										statuses: statuses, 
										currentUser: currentUser,
										cluster: clustername
									});
								});
							});

						});
					}else if(user.type === 'Moderator'){
						//get the list of user and the list of status

						console.log("@@@@@");
						console.log(clustername);
						var query = { $or:[{cluster: user.username}]};
						Status.find(query).sort({time: -1}).exec(function(err, statuses){
							
							User.find(query).sort({time: -1}).exec(function(err, users){
								
								User.find({}).sort({time: -1}).exec(function(err, allusers){

									Message.find({to: user.username}).sort({time: -1}).exec(function(err, messages){
								
										res.render('moderator',{
											messages: messages,
											allusers: allusers,
											users: users,
											user: user, 
											statuses: statuses, 
											currentUser: currentUser,
											cluster: clustername
										});
									});
								});

							});
							
						});
					}else if((req.session.user.type === 'Sysadmin') &&  user.type === 'Sysadmin'){
						//get the list of all clusters
						var query = {};
						console.log("@@@@@");
						console.log(clustername);
						Status.find(query).sort({time: -1}).exec(function(err, statuses){
							
							User.find({}).sort({time: -1}).exec(function(err, users){
								User.find({}).sort({time: -1}).exec(function(err, allusers){
									Message.find({to: user.username}).sort({time: -1}).exec(function(err, messages){
								
										res.render('sysadmin',{
											messages: messages,
											allusers: allusers,
											users: users,
											user: user, 
											statuses: statuses, 
											currentUser: currentUser,
											cluster: clustername
										});
									});
								});
							});

						});
					}else{
						backURL=req.header('Referer') || '/';
		  				res.redirect(backURL);	
					}



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
	var clustername = req.body.clustername;
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
					cluster: clustername,
					username: username,
					password: password,
					image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
					bio: 'Hello, this is my bio!',
					hidden: false,
					type: 'User'
				};
				console.log(userData);
				var newUser = new User(userData).save(function (err){

					req.session.user = userData;
					console.log('New user has been created!  type:'+req.session.user.type+" cluster:"+req.session.user.cluster);
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

// create new cluster
app.post('/cluster', function (req, res) {

	// Already logged in
	if (req.session.user) {

		var new_Cluster = req.body.newCluster;
		console.log("????"+new_Cluster);
		//create new cluster
		var clusterData = { 
			clustername: new_Cluster,
			users:[]
		};
		var newCluster = new Cluster(clusterData).save(function (err){
			//create new Moderator
			console.log(">>>>>>>>>>>>>>>>>>>>>");
			var userData = { 
				cluster: new_Cluster,
				username: new_Cluster,
				password: 'admin',
				image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
				bio: 'Hello, this is my bio!',
				hidden: false,
				type: 'Moderator'
			};
			var newUser = new User(userData).save(function (err){

				console.log('New Moderator has been created!');
				res.redirect('/');

			});

		});
	// Not logged in
	} else {
		res.redirect('/login');
	}
});

// create new cluster
app.post('/statuses', function (req, res) {

	// Already logged in
	if (req.session.user) {
			var status = req.body.status;
			var username = req.session.user.username;
			var pic = req.session.user.image;
			var cluster = req.session.user.cluster;
			var statusData = { 
				body: status,
				time: new Date().getTime(),
				username: username,
				image: pic,
				cluster: cluster
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



app.post('/message', function (req, res) {

	// Already logged in
	if (req.session.user) {

		var body = req.body.body;
		var time = new Date().getTime();
		var from = req.body.from;
		var to = req.body.to;
		var image = req.body.image;
		//create new cluster
		var message = { 
			body: body,
			time: time,
			from: from,
			to: to,
			image: image
		};

		var newMessage = new Message(message).save(function (err){
			//create new Moderator
			console.log(">>>>>> new message created!!");
			console.log(message);
			res.redirect('/');

		});
	// Not logged in
	} else {
		res.redirect('/login');
	}
});

