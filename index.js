const express = require('express')
const chalk = require('chalk')
const path = require('path')
const mongoose = require('mongoose')
const Note = require('./models/note');
const { addNote, getNotes, removeNote, updateNote } = require('./notes.controller')

const port = 3000
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', async (req, res) => {
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false
	})
})

app.post('/', async (req, res) => {
	await addNote(req.body.title)
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: true
	})
})

app.delete('/:id', async (req, res) => {
	await removeNote(req.params.id)
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false
	})
})

app.put('/:id', async (req, res) => {
	await updateNote(req.params.id, req.body)
	res.render('index', {
		title: 'Express App',
		notes: await getNotes(),
		created: false
	})
})

mongoose.connect(
	'mongodb+srv://sovremennik4400:qwerty123@cluster0.ohkru.mongodb.net/notes?retryWrites=true&w=majority&appName=Cluster0'
).then(async () => {
	await Note.create({title: 'test note'});

	app.listen(port, () => {
		console.log(chalk.green(`Server has been started on port ${port}...`))
	})
});

