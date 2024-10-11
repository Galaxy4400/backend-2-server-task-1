const chalk = require('chalk')
const Note = require('./models/note')

const addNote = async (title, owner) => {
	await Note.create({title, owner});

	console.log(chalk.bgGreen('Note was added!'))
}

const getNotes = async () => {
	const notes = await Note.find()

	return notes;
}

const removeNote = async (id, owner) => {
	const result = await Note.deleteOne({ _id: id, owner });

	if (!result.matchedCount) {
		throw new Error('No note to delete');
	}
	
	console.log(chalk.red(`Note with id="${id}" has been removed.`))
}

const updateNote = async ({ id, title }, owner) => {
	const result = await Note.updateOne({ _id: id, owner }, { title });

	if (!result.matchedCount) {
		throw new Error('No note to edit');
	}

	console.log(chalk.yellow(`Note with id="${id}" has been updated.`))
}

module.exports = {
	addNote, getNotes, removeNote, updateNote
}