require('dotenv').config();
require('colors');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

const Person = require('./models/person');

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456',
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523',
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345',
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
	},
];

morgan.token('person', function getPersonData(req) {
	return JSON.stringify(req.person);
});

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(assignPerson);
app.use(
	morgan(
		':method :url :status :res[content-length] - :response-time ms :person'
			.cyan
	)
);

app.get('/info', (req, res) => {
	const text = `Phonebook has info for ${persons.length} people`;
	const date = new Date();

	res.send(`${text} <br/> ${date}`);
});

app.get('/api/persons', async (req, res) => {
	try {
		const persons = await Person.find({});
		res.json(persons);
	} catch (error) {
		console.log(error.message);
	}
});

app.post('/api/persons', async (req, res, next) => {
	const { name, number } = req.body;

	if (!name || !number) {
		return res.status(400).json({
			error: 'name and number is required',
		});
	}

	try {
		const registerdPerson = await Person.find({ name });

		if (registerdPerson.length > 0) {
			const id = registerdPerson[0]._id;
			const person = { name, number };
			const updatedPerson = await Person.findByIdAndUpdate(
				id,
				person,
				{ new: true, runValidators: true, context: 'query' }
			);

			res.json({ person: updatedPerson });
		} else {
			const savedPerson = new Person({
				name,
				number,
			});

			await savedPerson.save();
			res.json({ person: savedPerson });
		}
	} catch (err) {
		next(err);
	}
});

app.get('/api/persons/:id', (req, res) => {
	const id = +req.params.id;
	const person = persons.find((person) => person.id === id);

	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
});

app.put('/api/persons/:id', async (req, res, next) => {
	const { name, number } = req.body;
	const id = req.params.id;

	try {
		const person = { name, number };
		const updatedPerson = await Person.findByIdAndUpdate(id, person, {
			new: true,
			runValidators: true,
			context: 'query',
		});

		res.json({ person: updatedPerson });
	} catch (err) {
		next(err);
	}
});

app.delete('/api/persons/:id', async (req, res, next) => {
	try {
		await Person.findByIdAndRemove(req.params.id);
		res.status(204).end();
	} catch (err) {
		next(err);
	}
});

function assignPerson(req, res, next) {
	req.person = req.body;
	next();
}

const errorHandler = (err, req, res, next) => {
	console.log(`${err.message}`.red);

	if (err.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' });
	} else if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message });
	}
	next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`.blue);
});
