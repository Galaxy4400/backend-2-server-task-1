const chalk = require('chalk');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'test';

const addUser = async (email, password) => {
	const passwordHash = await bcrypt.hash(password, 10);

	await User.create({email, password: passwordHash});

	console.log(chalk.bgGreen('User was added!'))
};


const loginUser = async (email, password) => {
	const user = await User.findOne({ email });

	if (!user) {
		throw new Error('user is not found');
	}

	const isPasswordCorrect = await bcrypt.compare(password, user.password);

	if (!isPasswordCorrect) {
		throw new Error('Wrong password');
	}

	console.log(chalk.bgGreen('User was login!'))

	return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30d' });
};

module.exports = { addUser, loginUser };