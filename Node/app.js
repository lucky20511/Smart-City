// required modules
var express = require('express');
var mongoose = require('mongoose');
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
var ejs = require('ejs-locals');
var request = require('request');
// connect to MongoDB

// mongoose.connect('mongodb://localhost/nodebook');

// initialize our app
var app = express();

var REST_URL = 'http://0.0.0.0:1314';

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


// // create user model 
// var User = mongoose.model('User', {
// 	username: String,
// 	password: String,
// 	image: String,
// 	bio: String,
// 	cluster:String,
// 	type:String
// });

// var Cluster = mongoose.model('Cluster', {
// 	clustername:String,
// 	users:Array
// });

// // create post model
// var Status = mongoose.model('Status', {
// 	body: String,
// 	time: Number,
// 	username: String,
// 	image: String,
// 	comments: Array,
// 	likes: Array,
// 	cluster:String
// });


// var Message = mongoose.model('Message', {
// 	body: String,
// 	time: Number,
// 	from: String,
// 	to: String,
// 	image: String
// });
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

	var URL = REST_URL+"/createsysadmin";
    console.log(URL);
    request({
	  uri: URL,
	  method: "POST"
	}, function(error, response, body) {
	  console.log(body);
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


	var URL = REST_URL+"/clusters";
    console.log(URL);
    request({
	  uri: URL,
	  method: "GET"
	}, function(error, response, body) {
		var ret = JSON.parse(body)
	  	if(ret.msg){
	  		clusters = [];
	  	}else{
	  		clusters = ret;
	  	}
	  	console.log(clusters);
		res.render('login', {error1: error1, error2: error2, cluster:clusters});
	});
});




// view other user's profile
app.get('/users/:username', function (req, res) {

	// Already logged in
	if (req.session.user) {

		var username = req.params.username.toLowerCase();
		var query = {username: username};
		var currentUser = req.session.user;

		//get user
	    console.log(REST_URL+"/user?username="+username);
	    request({
		  uri: REST_URL+"/user?username="+username,
		  method: "GET"
		}, function(error, response, body) {
			var ret = JSON.parse(body)
			var user;
		  	if(ret.msg){user = [];}
		  	else{user = ret;}

		  	//get clustername
		  	request({
			  uri: REST_URL+"/clusters",
			  method: "GET"
			}, function(error, response, body) {
				var ret = JSON.parse(body)
				console.log("QQQQQQQQQQQQQQQQQQQ");
				console.log(ret);
				var clustername;
			  	if(ret.msg){ clustername = [];}
			  	else{ clustername = ret;}


			  	if(user.type === 'User'){


			  		//Get statuses
			  		request({
					  uri: REST_URL+"/posts?cluster=ALL,"+user.cluster,
					  method: "GET"
					}, function(error, response, body) {
						var ret = JSON.parse(body)
						var statuses;
					  	if(ret.msg){ statuses = [];}
					  	else{ statuses = ret;}

					  	//Get allusers
				  		request({
						  uri: REST_URL+"/allclusters",
						  method: "GET"
						}, function(error, response, body) {
							var ret = JSON.parse(body)
							var allusers;
						  	if(ret.msg){ allusers = [];}
						  	else{ allusers = ret;}


						  	//Get messages
					  		request({
							  uri: REST_URL+"/messages_all?to="+user.username,
							  method: "GET"
							}, function(error, response, body) {
								var ret = JSON.parse(body)
								var messages;
							  	if(ret.msg){ messages = [];}
							  	else{ messages = ret;}


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

			  		console.log("EEEEEEEEEEEEEEEE");
			  		console.log(REST_URL+"/posts?cluster=ALL,"+user.cluster);
			  		//Get statuses
			  		request({
					  uri: REST_URL+"/posts?cluster=ALL,"+user.cluster,
					  method: "GET"
					}, function(error, response, body) {

						var ret = JSON.parse(body)
						console.log("EEEEEEEEEEEEEEEE");
			  			console.log(ret);
						var statuses;
					  	if(ret.msg){ statuses = [];}
					  	else{ statuses = ret;}


					  	//Get users
				  		request({
						  uri: REST_URL+"/users?cluster="+user.cluster,
						  method: "GET"
						}, function(error, response, body) {
							var ret = JSON.parse(body)
							var users;
						  	if(ret.msg){ users = [];}
						  	else{ users = ret;}


						  	//Get allusers
					  		request({
							  uri: REST_URL+"/allclusters",
							  method: "GET"
							}, function(error, response, body) {
								var ret = JSON.parse(body)
								var allusers;
							  	if(ret.msg){ allusers = [];}
							  	else{ allusers = ret;}


							  	//Get messages
						  		request({
								  uri: REST_URL+"/messages_all?to="+user.username,
								  method: "GET"
								}, function(error, response, body) {
									var ret = JSON.parse(body)
									var messages;
								  	if(ret.msg){ messages = [];}
								  	else{ messages = ret;}


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
			  		//Get all statuses
			  		request({
					  uri: REST_URL+"/posts_all",
					  method: "GET"
					}, function(error, response, body) {
						var ret = JSON.parse(body)
						var statuses;
					  	if(ret.msg){ statuses = [];}
					  	else{ statuses = ret;}


					  	//Get users
				  		request({
						  uri: REST_URL+"/users?cluster="+user.cluster,
						  method: "GET"
						}, function(error, response, body) {
							var ret = JSON.parse(body)
							var users;
						  	if(ret.msg){ users = [];}
						  	else{ users = ret;}


						  	//Get allusers
					  		request({
							  uri: REST_URL+"/allclusters",
							  method: "GET"
							}, function(error, response, body) {
								var ret = JSON.parse(body)
								var allusers;
							  	if(ret.msg){ allusers = [];}
							  	else{ allusers = ret;}


							  	//Get messages
						  		request({
								  uri: REST_URL+"/messages_all?to="+user.username,
								  method: "GET"
								}, function(error, response, body) {
									var ret = JSON.parse(body)
									var messages;
								  	if(ret.msg){ messages = [];}
								  	else{ messages = ret;}


								  	res.render('sysadmin',{
										messages: messages,
										allusers: allusers,
										users: allusers,
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


	var URL = REST_URL+"/login";
	var post_body = {
		"username": req.body.username,
		"password": req.body.password
	};
    console.log(URL);
    console.log(req.body);
    request.post({
	  uri: URL,
	  body: JSON.stringify(req.body)
	}, function(err, response, body) {
		if(err){
			console.log("!!!!!! Error");
			console.log(err);
		}
		console.log("!!!!!!");
		console.log(response);
		var ret = JSON.parse(body);
		console.log(ret);
	  	if(ret.msg){
	  		res.redirect('/login?error2=1');
	  	}else{
	  		req.session.user = ret;
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
		var post_body = { 
			cluster: clustername,
			username: username,
			password: password,
			image: 'http://leadersinheels.com/wp-content/uploads/facebook-default.jpg', //default image
			bio: 'Hello, this is my bio!',
			type: 'User'
		};
		var URL = REST_URL+"/signup";
	    console.log(req.body);
	    request.post({
		  uri: URL,
		  body: JSON.stringify(post_body)
		}, function(err, response, body) {
			if(err){
				console.log("!!!!!! Error");
				console.log(err);
			}
			console.log("!!!!!!");
			console.log(response);
			var ret = JSON.parse(body);
			console.log(ret);
		  	if(ret.msg){
		  		res.redirect('/login?error1=1');
		  	}else{
		  		req.session.user = ret;
		  		res.redirect(path.join('/users/'+username));
		  	}
		  
		});

	}
});


/////TODO
// update other user's profile
app.post('/profile', function (req, res) {

	// Already logged in
	if (req.session.user) {
	

		var newBio = req.body.bio;
		var newImage = req.body.image;

		var post_body = {
			"bio": newBio, 
			"image": newImage
		};

		var URL = REST_URL+"/users?username="+req.session.user.username;
	    console.log(req.body);
	    request.put({
		  uri: URL,
		  body: JSON.stringify(req.body)
		}, function(err, response, body) {
			if(err){
				console.log("!!!!!! Error");
			}
			console.log("ZZZZZZZZZ");
			console.log(body);
			var ret = JSON.parse(body);
			console.log(ret);
		  	if(ret.msg){
		  		res.redirect('/');
		  	}else{
		  		req.session.user = ret;
		  		res.redirect(path.join('/users/'+req.session.user.username));
		  	}
		  
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

		var URL = REST_URL+"/clusters";

		var post_body = {
			"clustername": req.body.newCluster
		};

		request.post({
		  uri: URL,
		  body: JSON.stringify(post_body)
		}, function(err, response, body) {
			if(err){
				console.log("!!!!!! Error");
				console.log(err);
			}
			console.log("!!!!!!");
			console.log(response);
			var ret = JSON.parse(body);
			console.log(ret);
		  	if(ret.msg){
		  		res.redirect('/');
		  	}else{
		  		res.redirect('/');
		  	}
		  
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

			var URL = REST_URL+"/posts";

			var status = req.body.status;
			var username = req.session.user.username;
			var pic = req.session.user.image;
			var cluster = req.session.user.cluster;
			var post_body = { 
				body: status,
				time: new Date().getTime(),
				username: username,
				image: pic,
				cluster: cluster
			};

			request.post({
			  uri: URL,
			  body: JSON.stringify(post_body)
			}, function(err, response, body) {
				if(err){
					console.log("!!!!!! Error");
					console.log(err);
				}
				console.log("!!!!!!");
				console.log(response);
				var ret = JSON.parse(body);
				console.log(ret);
			  	if(ret.msg){
			  		res.redirect(path.join('/users/'+username));
			  	}else{
			  		res.redirect(path.join('/users/'+username));
			  	}
			  
			});

	// Not logged in
	} else {
		res.redirect('/login');
	}
});



app.post('/message', function (req, res) {

	// Already logged in
	if (req.session.user) {

		var URL = REST_URL+"/messages";

		var body = req.body.body;
		var time = new Date().getTime();
		var from = req.body.from;
		var to = req.body.to;
		var image = req.body.image;
		//create new cluster
		var post_body = { 
			body: body,
			time: time,
			from: from,
			to: to,
			image: image
		};

		request.post({
			  uri: URL,
			  body: JSON.stringify(post_body)
			}, function(err, response, body) {
				if(err){
					console.log("!!!!!! Error");
					console.log(err);
				}
				console.log("!!!!!!");
				console.log(response);
				var ret = JSON.parse(body);
				console.log(ret);
			  	if(ret.msg){
			  		res.redirect('/');
			  		console.log(">>>>>> new message created!!");
			  	}else{
			  		console.log(">>>>>> new message created!!");
					res.redirect('/');
			  	}
			  
			});

	// Not logged in
	} else {
		res.redirect('/login');
	}
});

