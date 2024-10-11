const express = require('express');
const chalk = require('chalk');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller');
const { addUser, loginUser } = require('./users.controller');
const auth = require('./middlewares/auth');

const port = 3000;
const app = express();

app.set('view engine', 'ejs');
app.set('views', 'pages');

app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/login', async (req, res) => {
	res.render('login', {
		title: 'Express App',
		error: undefined,
	});
});

app.post('/login', async (req, res) => {
	try {
		const token = await loginUser(req.body.email, req.body.password);

		res.cookie('token', token);

		res.redirect('/');
	} catch (error) {
		res.render('login', {
			title: 'Express App',
			error: error.message,
		});
	}
});

app.get('/register', async (req, res) => {
	res.render('register', {
		title: 'Express App',
		error: undefined,
	});
});

app.post('/register', async (req, res) => {
	try {
		await addUser(req.body.email, req.body.password);

		res.redirect('/login');
	} catch (error) {
		if (error.code === 11000) {
			res.render('register', {
				title: 'Express App',
				error: 'Email is alrady registered',
			});

			return;
		}
		res.render('register', {
			title: 'Express App',
			error: error.message,
		});
		console.log(error);
	}
});

app.use(auth);

app.get('/', async (req, res) => {
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		userEmail: req.user.email,
		created: false,
		error: false,
	});
});

app.post('/', async (req, res) => {
	try {
		await addNote(req.body.title, req.user.email);
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: true,
			error: false,
		});
	} catch (error) {
		console.error('Creation error', error);;
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			created: false,
			error: true,
		});
	};
});

app.delete('/:id', async (req, res) => {
	try {
		await removeNote(req.params.id, req.user.email);
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: false,
		});
	} catch (error) {
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: error.message,
		});
	}
});

app.put('/:id', async (req, res) => {
	try {
		await updateNote({ id: req.params.id, title: req.body.title}, req.user.email);
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: false,
		});
	} catch (error) {
		res.render('index', {
			title: 'Express App',
			notes: await getNotes(),
			userEmail: req.user.email,
			created: false,
			error: error.message,
		});
	}
});

mongoose.connect(
	'mongodb+srv://sovremennik4400:qwerty123@cluster0.ohkru.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0'
).then(() => {
	app.listen(port, () => {
		console.log(chalk.green(`Server has been started on port ${port}...`));
	});
});

