const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

mongoose
	.connect(url)
	.then(() => {
		console.log('connected to MongoDB'.magenta);
	})
	.catch((err) =>
		console.log(`error connecting to MongoDB: ${err.message}`)
	);

const personSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			minLength: 3,
		},
		number: {
			type: String,
			required: true,
			minLength: 8,
			validate: {
				validator: function (v) {
					return /\d{2}-/.test(v);
				},
				message: (props) =>
					`${props.value} is not a valid phone number!`,
			},
		},
	},
	{ timestamps: true }
);

personSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model('Person', personSchema);
