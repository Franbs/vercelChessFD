const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const app = express();
const User = require("./models/user");
const port = 3000;
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
const users = {};
const Chat = require("./models/chat");

// Sockets
io.on('connection', (socket) => {
	socket.on('join-room', (name, room) => {
		socket.join(room);
		users[socket.id] = name;
		let text = name + ' has joined the chat';
		socket.to(room).emit('join', text);
		/*const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
		console.log(sockets);*/
	});

	socket.on('show-user', (name, room) => {
		socket.join(room);
		users[socket.id] = name;
		socket.to(room).emit('join', name);
		/*const sockets = Array.from(io.sockets.sockets).map(socket => socket[0]);
		console.log(sockets);*/
	});

	socket.on('chat', (msg, room) => {
		io.to(room).emit('chat', { msg: msg, name: users[socket.id] });
		let chatMessage = new Chat({ message: msg, sender: users[socket.id], room: room});
    	chatMessage.save();
	});

	socket.on('invite', (name, enemy) => {
		io.to(enemy).emit('chat', { msg: "hola", name: name });
	});

	socket.on('disconnect', () => {
		let text = users[socket.id] + ' has left the chat';
		socket.broadcast.emit('user-disconnected', text);
	});
});

// Database
mongoose.connect('mongodb+srv://admin:admin@cluster0.upami.mongodb.net/ChessFD?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected");
}).catch((err) => console.log(err));

// Middleware
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(session({
	secret: "mySecret",
	resave: false,
	saveUninitialized: true
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	done(null, user.id);
});

passport.deserializeUser(function (id, done) {
	User.findById(id, function (err, user) {
		done(err, user);
	});
});

passport.use(new localStrategy(function (username, password, done) {
	User.findOne({ username: username }, function (err, user) {
		if (err) return done(err);
		if (!user) return done(null, false, { message: 'Incorrect username.' });

		bcrypt.compare(password, user.password, function (err, res) {
			if (err) return done(err);
			if (res === false) return done(null, false, { message: 'Incorrect password.' });
			
			return done(null, user);
		});
	});
}));

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect('./userManagement/login');
}

function isLoggedOut(req, res, next) {
	if (!req.isAuthenticated()) return next();
	res.redirect('/');
}

// Routes
app.get('/', (req, res) => {
	res.render("index", { title: "Home", user: req.user });
});

app.get('/login', isLoggedOut, (req, res) => {
	const response = {
		title: "Login",
		error: req.query.error
	}

	res.render('./userManagement/login', response);
});

app.post('/login', passport.authenticate('local', {
	successRedirect: '/play',
	failureRedirect: '/login?error=true'
}));

app.get('/logout', function (req, res) {
	req.logout();
	res.redirect('/');
});

app.get('/play', isLoggedIn, function (req, res) {
	res.render("play", { title: "ChessFD", user: req.user });
});

app.get('/signup', isLoggedOut, (req, res) => {
	const response = {
		title: "Signup",
		error: req.query.error
	}

	res.render('./userManagement/signup', response);
});

app.post('/signup', async (req, res) => {
	const exists = await User.exists({ username: req.body.username });

	if (exists) {
		res.redirect('./userManagement/login');
		return;
	};

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash(req.body.password, salt, function (err, hash) {
			if (err) return next(err);
			
			const newUser = new User({
				username: req.body.username,
				password: hash
			});

			newUser.save();

			//user = req.body.username;

			req.login(newUser, error => {
				res.redirect('/play');
			});
		});
	});
});

app.get('/chat', isLoggedIn, (req, res) => {
	res.render("./chatLayouts/chat", { title: "Chat", user: req.user, room: req.query.room });
});

app.get('/rooms', isLoggedIn, (req, res) => {
	res.render("./chatLayouts/rooms", { title: "Room", user: req.user });
});

app.get('/players', isLoggedIn, function (req, res) {
	res.render("players", { title: "ChessFD", user: req.user });
});

app.get('/board', /*isLoggedIn,*/ function (req, res) {
	res.render("board", { title: "ChessFD", user: req.user });
});

app.get('/history', isLoggedIn, function (req, res) {
	res.render("./chatLayouts/history", { title: "History", user: req.user });
});

app.get('/room', isLoggedIn, (req, res, next) => {
	Chat.find({ room: req.query.room }).then(chat => {
		res.render("./chatLayouts/room", { title: "Room", user: req.user, room: req.query.room, chat: chat });
	});
});

app.get('/deleteHistory', isLoggedIn, (req, res) => {
	Chat.deleteMany({ room: req.query.room }).then(chat => {
		res.render("./chatLayouts/room", { title: "Room", user: req.user, room: req.query.room, chat: chat });
	});
});

// Setup admin user
app.get('/setup', async (req, res) => {
	const exists = await User.exists({ username: "admin" });

	if (exists) {
		res.redirect('./userManagement/login');
		return;
	};

	bcrypt.genSalt(10, function (err, salt) {
		if (err) return next(err);
		bcrypt.hash("pass", salt, function (err, hash) {
			if (err) return next(err);
			
			const newAdmin = new User({
				username: "admin",
				password: hash
			});

			newAdmin.save();

			res.redirect('./userManagement/login');
		});
	});
});

server.listen(port, () => {
    console.log("Server listening on port http://localhost:" + port);
});