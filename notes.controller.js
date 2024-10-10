const chalk = require('chalk')
const Note = require('./models/note')

const addNote = async (title) => {
	await Note.create({title});

	console.log(chalk.bgGreen('Note was added!'))
}

const getNotes = async () => {
	const notes = await Note.find()

	return notes;
}

const removeNote = async (id) => {
	await Note.deleteOne({ _id: id });
	
	console.log(chalk.red(`Note with id="${id}" has been removed.`))
}

const updateNote = async ({ id, title }) => {
	await Note.updateOne({ _id: id }, { title });

	console.log(chalk.yellow(`Note with id="${id}" has been updated.`))
}

module.exports = {
	addNote, getNotes, removeNote, updateNote
}